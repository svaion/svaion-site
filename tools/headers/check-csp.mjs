#!/usr/bin/env node
// Loads the served site in headless Chromium and fails on any CSP violation or console error, or if
// the page stops working under the policy: React must hydrate, the reveal gate (`js` on <html>) must
// switch on, the demo tabs must switch, and the mobile menu must open.
// usage: node tools/headers/check-csp.mjs [baseUrl=http://127.0.0.1:4173]
// Serve the build with tools/preview/serve.mjs first; it applies _headers like the host does.
import { spawn } from 'node:child_process';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const base = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '');
const CHROME = process.env.CHROME || '/usr/bin/chromium';
const profile = join(tmpdir(), `check-csp-${process.pid}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--mute-audio',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`,
  // Extra flags from the environment, e.g. CHROME_ARGS=--no-sandbox on CI runners.
  ...(process.env.CHROME_ARGS || '').split(' ').filter(Boolean),
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });
process.on('exit', () => {
  try { chrome.kill('SIGKILL'); } catch {}
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
});

const wsUrl = await new Promise((res, rej) => {
  let buf = '';
  const timer = setTimeout(() => rej(new Error('chromium did not print a DevTools URL in 20 s')), 20000);
  chrome.stderr.on('data', (d) => {
    buf += d;
    const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) { clearTimeout(timer); res(m[1]); }
  });
});

// ---- minimal CDP client, as in tools/parity/capture.mjs ----
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let nextId = 1;
const pending = new Map();
const listeners = new Set();
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(msg.error.message)) : res(msg.result);
  } else if (msg.method) for (const l of listeners) l(msg);
};
const send = (method, params = {}, sessionId) => {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
};
async function evaluate(sessionId, expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}
const poll = (sessionId, expression, ms = 4000) =>
  evaluate(sessionId, `new Promise((resolve) => {
    const t0 = performance.now();
    const tick = () => { if (${expression}) return resolve(true); if (performance.now() - t0 > ${ms}) return resolve(false); setTimeout(tick, 50); };
    tick();
  })`);

const HYDRATED = `Object.keys(document.body).some((k) => k.startsWith('__react'))`;

async function visit(path, { width = 1440, height = 900, expectStatus = 200, steps = [] } = {}) {
  const problems = [];
  const notes = [];
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const listener = (msg) => {
    if (msg.sessionId !== sessionId) return;
    if (msg.method === 'Log.entryAdded' && ['error', 'warning'].includes(msg.params.entry.level)) {
      const { source, text, url } = msg.params.entry;
      // Chromium's own notice for blocked inline scripts arrives here with source "security".
      const expected404 = expectStatus === 404 && source === 'network' && url === base + path;
      if (!expected404 && (msg.params.entry.level === 'error' || /Content Security Policy/i.test(text))) problems.push(`console (${source}): ${text}${url ? ` [${url}]` : ''}`);
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      problems.push(`console.error: ${msg.params.args.map((a) => a.value ?? a.description).join(' ')}`);
    }
    if (msg.method === 'Runtime.exceptionThrown') problems.push(`exception: ${msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text}`);
    if (msg.method === 'Network.responseReceived' && msg.params.type === 'Document') {
      const { status, headers } = msg.params.response;
      notes.push({ status, csp: Object.entries(headers).find(([k]) => k.toLowerCase() === 'content-security-policy')?.[1] });
    }
  };
  listeners.add(listener);
  try {
    await Promise.all(['Page.enable', 'Runtime.enable', 'Log.enable', 'Network.enable'].map((m) => send(m, {}, sessionId)));
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 }, sessionId);
    // DevTools-injected scripts are exempt from the page's CSP, so this listener always runs.
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `window.__cspViolations = []; document.addEventListener('securitypolicyviolation', (e) => window.__cspViolations.push(e.violatedDirective + ' blocked ' + (e.blockedURI || 'inline') + ' (' + e.disposition + ')'));`,
    }, sessionId);
    const loaded = new Promise((res) => {
      const l = (msg) => { if (msg.sessionId === sessionId && msg.method === 'Page.loadEventFired') { listeners.delete(l); res(); } };
      listeners.add(l);
    });
    await send('Page.navigate', { url: base + path }, sessionId);
    await loaded;

    const doc = notes.at(-1);
    if (!doc) problems.push('no document response seen');
    else {
      if (doc.status !== expectStatus) problems.push(`status ${doc.status}, expected ${expectStatus}`);
      if (!doc.csp) problems.push('no Content-Security-Policy header');
    }
    const metaPolicy = await evaluate(sessionId, `document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content || ''`);
    if (!/script-src 'self' 'sha256-/.test(metaPolicy)) problems.push('no per-page script hash policy in <meta>');
    if (!(await poll(sessionId, HYDRATED))) problems.push('React did not hydrate');
    for (const [label, expression, action] of steps) {
      if (action) await evaluate(sessionId, `(() => { ${action} })()`);
      if (!(await poll(sessionId, expression, 2000))) problems.push(`${label}: failed`);
    }
    await sleep(300);
    const violations = await evaluate(sessionId, 'window.__cspViolations');
    for (const v of violations) problems.push(`violation: ${v}`);
    const hashes = (metaPolicy.match(/'sha256-/g) || []).length;
    return { path, width, status: doc?.status, hashes, problems };
  } finally {
    listeners.delete(listener);
    await send('Target.closeTarget', { targetId }).catch(() => {});
  }
}

const exists = async (path) => (await fetch(base + path, { method: 'HEAD', redirect: 'manual' })).status;

const checks = [
  ['/', {
    steps: [
      ['reveal gate on <html>', `document.documentElement.classList.contains('js')`],
      ['reveal marks sections as they scroll in', `document.querySelectorAll('.in').length > 0`, `document.querySelector('#demo').scrollIntoView({ block: 'center' })`],
      ['demo tab switches', `document.querySelector('#tab-docs')?.getAttribute('aria-selected') === 'true' && !document.querySelector('#demo-docs')?.hidden`, `document.querySelector('#tab-docs').click()`],
    ],
  }],
  ['/', {
    width: 390, height: 844,
    steps: [['mobile menu opens', `document.querySelector('.menu-btn')?.getAttribute('aria-expanded') === 'true' && !document.querySelector('#menu').hidden`, `document.querySelector('.menu-btn').click()`]],
  }],
];
if ((await exists('/privacy/')) === 200) checks.push(['/privacy/', {}]);
else console.log('/privacy/ not in this build; skipped');
checks.push(['/this-page-does-not-exist', { expectStatus: 404 }]);

let failed = 0;
for (const [path, options] of checks) {
  const r = await visit(path, options);
  const label = `${r.path} @${r.width}px: status ${r.status}, ${r.hashes} script hashes`;
  if (r.problems.length) {
    failed++;
    console.log(`FAIL ${label}`);
    for (const p of [...new Set(r.problems)].slice(0, 12)) console.log(`     - ${p.slice(0, 300)}`);
  } else console.log(`ok   ${label}`);
}

ws.close();
process.exit(failed ? 1 : 0);
