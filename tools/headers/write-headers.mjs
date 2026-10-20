#!/usr/bin/env node
// postbuild: security headers for the static export.
// usage: node tools/headers/write-headers.mjs [outDir=out]
//
// Writes <outDir>/_headers (Cloudflare Pages and Netlify read it) and gives every HTML page a
// <meta http-equiv="Content-Security-Policy"> whose script-src lists the sha256 of each of that
// page's inline scripts. Two policies, both enforced by the browser:
//   header (site-wide, every response, 404s included): sources, framing, base, forms; script-src
//     allows inline because the header cannot know which page it is on;
//   meta (per page): script-src 'self' plus that page's hashes, so only Next.js's own inline
//     scripts run. A script has to pass both, which leaves exactly 'self' + the hashes.
// Why not hashes in the header: Next.js inlines the page's RSC payload as ~20 scripts per page,
// so one site-wide list passes Cloudflare's 2,000-character line limit after two or three pages.
// Per-path header rules don't work either: an unknown path matches only /*, so its 404 page would
// get the wrong policy, and Cloudflare joins duplicate headers from overlapping rules.
// The meta tag carries no frame-ancestors (browsers ignore it there); the header does.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const outDir = process.argv[2] || 'out';

// Cloudflare Pages: https://developers.cloudflare.com/pages/configuration/headers/
const MAX_RULES = 100;
const MAX_LINE = 2000;

const sitePolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'", // React renders inline style attributes (--i, --d, --g)
  "img-src 'self' data:", // the stylesheet draws its patterns with data: SVGs
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const rules = [
  ['/*', {
    'Content-Security-Policy': sitePolicy,
    // No includeSubDomains or preload: browsers remember both for a year and they are hard to undo.
    'Strict-Transport-Security': 'max-age=31536000',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  }],
  // File names under /_next/static carry a content hash, so a new build never reuses one.
  ['/_next/static/*', { 'Cache-Control': 'public, max-age=31536000, immutable' }],
  // Brand files other places link to by fixed URL (the email signature's logo): the name never
  // changes, so cache for a day rather than forever, and a replaced file reaches inboxes by tomorrow.
  ['/brand/*', { 'Cache-Control': 'public, max-age=86400' }],
];

const fail = (message) => {
  console.error(`write-headers: ${message}`);
  process.exit(1);
};

// ---- per-page script policy ----
const walk = (dir) => readdirSync(dir, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));
const pages = walk(outDir).filter((f) => f.endsWith('.html'));
if (pages.length === 0) fail(`no HTML files in ${outDir}/; run next build first`);

const META = /<meta http-equiv="Content-Security-Policy" content="[^"]*"\/>/g;
const CHARSET = '<meta charSet="utf-8"/>';
let largest = { page: '', hashes: 0, length: 0 };

for (const page of pages) {
  const name = relative(outDir, page);
  const html = readFileSync(page, 'utf8').replace(META, ''); // rerunning replaces the old tag
  if (/<[a-z][^>]*\son[a-z]+\s*=/i.test(html)) fail(`${name} has an inline event handler, which the policy blocks`);
  if (/(href|src|action)\s*=\s*["']?\s*javascript:/i.test(html)) fail(`${name} has a javascript: URL, which the policy blocks`);

  const hashes = new Set();
  for (const [, attrs, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/i.test(attrs)) continue;
    if (/\btype\s*=\s*["']?application\/(ld\+)?json/i.test(attrs)) continue; // data, not executed
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }

  // The tag must come before the first script it governs, and after the charset (first 1,024 bytes).
  const at = html.indexOf(CHARSET);
  if (at === -1) fail(`${name} has no ${CHARSET} to anchor the policy after`);
  const insertAt = at + CHARSET.length;
  if (/<script\b/i.test(html.slice(0, insertAt))) fail(`${name} runs a script before the policy could apply`);

  const content = [`script-src 'self' ${[...hashes].join(' ')}`.trim(), "object-src 'none'", "base-uri 'self'"].join('; ');
  const tag = `<meta http-equiv="Content-Security-Policy" content="${content}"/>`;
  writeFileSync(page, html.slice(0, insertAt) + tag + html.slice(insertAt));
  if (tag.length > largest.length) largest = { page: name, hashes: hashes.size, length: tag.length };
}

// ---- _headers ----
if (rules.length > MAX_RULES) fail(`${rules.length} rules; Cloudflare Pages allows ${MAX_RULES}`);
const seen = new Map();
const lines = ['# Written by tools/headers/write-headers.mjs after every build; edit that script, not this file.'];
// Two rules can match one request when either path is a prefix of the other; /* matches every request.
const overlap = (a, b) => {
  const [x, y] = [a, b].map((path) => path.replace(/\*$/, ''));
  return x.startsWith(y) || y.startsWith(x);
};
for (const [path, headers] of rules) {
  lines.push(path);
  for (const [header, value] of Object.entries(headers)) {
    // Cloudflare joins a header set by two rules that match the same request with a comma.
    const clash = (seen.get(header) || []).find((other) => overlap(other, path));
    if (clash) fail(`${header} is set by both ${clash} and ${path}; matching rules would join them`);
    seen.set(header, [...(seen.get(header) || []), path]);
    const line = `  ${header}: ${value}`;
    if (line.length > MAX_LINE) fail(`${path} ${header} is ${line.length} characters; Cloudflare Pages allows ${MAX_LINE} per line`);
    lines.push(line);
  }
}
writeFileSync(join(outDir, '_headers'), `${lines.join('\n')}\n`);

console.log(`write-headers: ${pages.length} pages, largest policy ${largest.length} characters (${largest.hashes} inline scripts, ${largest.page}); ${rules.length} header rules`);
