#!/usr/bin/env node
// capture2: CDP-driven frozen-frame screenshots of a page, scroll-aware.
// usage: node capture.mjs <page.html> <outdir> <spec.json> [--keep]
// spec.json: [{ name, width, height, scroll, before, settle, times, clip, pad }]
//   scroll: selector scrolled to block:center (instant) or null
//   before: JS (may await) run after the scroll, e.g. "document.querySelector('#tab-docs').click()"
//   settle: ms to wait (real time) after scroll/before, so observers fire and CSS animations start
//   times:  ms; every time-based animation from document.getAnimations() is paused at currentTime = t
//           (scroll-driven ones follow the scroll position instead)
//   clip:   selector whose bounding box (+pad CSS px) is captured, or null for the viewport
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const args = process.argv.slice(2).filter(a => a !== '--keep');
const keep = process.argv.includes('--keep');
if (args.length !== 3) {
  console.error('usage: node capture.mjs <page.html> <outdir> <spec.json> [--keep]');
  process.exit(2);
}
const [pagePath, outDir, specPath] = args.map(a => (/^https?:\/\//.test(a) ? a : resolve(a)));
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
mkdirSync(outDir, { recursive: true });

const CHROME = process.env.CHROME || '/usr/bin/chromium';
const here = dirname(fileURLToPath(import.meta.url));
const profile = join(here, `.profile-${process.pid}`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ---- launch the browser and find its DevTools websocket ----
const chrome = spawn(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

function cleanup() {
  try { chrome.kill('SIGKILL'); } catch {}
  if (!keep) { try { rmSync(profile, { recursive: true, force: true }); } catch {} }
}
// the profile can only be removed once chromium has actually exited
async function shutdown() {
  if (chrome.exitCode === null && chrome.signalCode === null) {
    const gone = new Promise(r => chrome.once('exit', r));
    chrome.kill('SIGKILL');
    await gone;
  }
  if (!keep) rmSync(profile, { recursive: true, force: true });
}
process.on('exit', cleanup);
process.on('SIGINT', () => process.exit(130));

const wsUrl = await new Promise((res, rej) => {
  let buf = '';
  const timer = setTimeout(() => rej(new Error('chromium did not print a DevTools URL in 20 s')), 20000);
  chrome.stderr.on('data', d => {
    buf += d;
    const m = buf.match(/DevTools listening on (ws:\/\/\S+)/);
    if (m) { clearTimeout(timer); res(m[1]); }
  });
  chrome.on('exit', code => rej(new Error(`chromium exited (${code}) before DevTools came up`)));
});

// ---- minimal CDP client over one browser-level socket (flattened sessions) ----
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let nextId = 1;
const pending = new Map();
const listeners = new Set();
ws.onmessage = ev => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(`${msg.error.message} ${msg.error.data || ''}`)) : res(msg.result);
  } else if (msg.method) {
    for (const l of listeners) l(msg);
  }
};
function send(method, params = {}, sessionId) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((res, rej) => pending.set(id, { res, rej }));
}
function waitFor(method, sessionId, ms = 30000) {
  return new Promise((res, rej) => {
    const t = setTimeout(() => { listeners.delete(l); rej(new Error(`timeout waiting for ${method}`)); }, ms);
    const l = msg => {
      if (msg.method === method && msg.sessionId === sessionId) { clearTimeout(t); listeners.delete(l); res(msg.params); }
    };
    listeners.add(l);
  });
}
async function evaluate(sessionId, expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
  if (r.exceptionDetails) throw new Error(`page JS error: ${r.exceptionDetails.exception?.description || r.exceptionDetails.text}`);
  return r.result.value;
}

const RAF2 = 'new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(true))))';
const url = /^https?:\/\//.test(pagePath) ? pagePath : pathToFileURL(pagePath).href;
const failures = [];

for (const shot of spec) {
  const started = Date.now();
  const { name, width = 1440, height = 900, scroll = null, before = null, settle = 400, times = [0], clip = null, pad = 0, reduced = false } = shot;
  let targetId;
  try {
    ({ targetId } = await send('Target.createTarget', { url: 'about:blank' }));
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: width < 600 }, sessionId);
    if (reduced) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }, sessionId);
    const loaded = waitFor('Page.loadEventFired', sessionId);
    await send('Page.navigate', { url }, sessionId);
    await loaded;
    await evaluate(sessionId, `document.fonts ? document.fonts.ready.then(() => true) : true`);

    if (scroll) {
      const ok = await evaluate(sessionId, `(() => {
        const el = document.querySelector(${JSON.stringify(scroll)});
        if (!el) return false;
        document.documentElement.style.scrollBehavior = 'auto';
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        return true;
      })()`);
      if (!ok) throw new Error(`scroll selector not found: ${scroll}`);
    }
    if (before) await evaluate(sessionId, `(async () => { ${before}\n })().then(() => true)`);
    await sleep(settle);
    await evaluate(sessionId, RAF2);

    const files = [];
    for (const t of times) {
      await evaluate(sessionId, `(() => { document.getAnimations().filter(a => a.timeline instanceof DocumentTimeline).forEach(a => { a.pause(); a.currentTime = ${Number(t)}; }); return ${RAF2}; })()`);
      const params = { format: 'png' };
      if (clip) {
        const box = await evaluate(sessionId, `(() => {
          const el = document.querySelector(${JSON.stringify(clip)});
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
        })()`);
        if (!box) throw new Error(`clip selector not found: ${clip}`);
        const x = Math.max(0, box.x - pad), y = Math.max(0, box.y - pad);
        params.clip = { x, y, width: box.w + pad * 2 - (x - (box.x - pad)), height: box.h + pad * 2 - (y - (box.y - pad)), scale: 1 };
      }
      const { data } = await send('Page.captureScreenshot', params, sessionId);
      const file = join(outDir, `${name}-${t}.png`);
      writeFileSync(file, Buffer.from(data, 'base64'));
      files.push([t, file]);
    }

    // labeled contact sheet
    const cols = Math.min(files.length, files.length > 6 ? 4 : 3);
    // shrink only frames wider than 720 px; cells take the largest frame's size
    const montage = ['montage', '-font', process.env.SHEET_FONT || 'Liberation-Sans', '-pointsize', '20', '-background', '#E2E8F0'];
    for (const [t, f] of files) montage.push('-label', `t=${t}ms`, '(', f, '-resize', '720x>', ')');
    montage.push('-tile', `${cols}x`, '-geometry', '+8+8', join(outDir, `sheet-${name}.png`));
    execFileSync('magick', montage, { stdio: 'inherit' });
    console.log(`${name}: ${files.length} frames in ${((Date.now() - started) / 1000).toFixed(1)} s -> sheet-${name}.png`);
  } catch (e) {
    failures.push(name);
    console.error(`${name}: FAILED - ${e.message}`);
  } finally {
    if (targetId) await send('Target.closeTarget', { targetId }).catch(() => {});
  }
}

ws.close();
await shutdown();
process.exit(failures.length ? 1 : 0);
