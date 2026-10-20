#!/usr/bin/env node
// Serves the static export the way Cloudflare Pages does, so a preview shows production behavior:
// _headers applied, /about -> /about/ redirects, /about/ -> about/index.html, .html stripped,
// and 404.html with status 404 for anything else.
// usage: node tools/preview/serve.mjs [dir=out] [--port 4173] [--host 127.0.0.1] [--headers file]
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

const argv = process.argv.slice(2);
const option = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const [value] = argv.splice(i, 2).slice(1);
  return value;
};
const port = Number(option('port', 4173));
const host = option('host', '127.0.0.1');
const headersOverride = option('headers', null);
const root = resolve(argv[0] || 'out');
if (!existsSync(join(root, 'index.html'))) {
  console.error(`serve: ${root}/index.html not found; run npm run build first`);
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
};

// ---- _headers: a path line, then indented "Name: value" or "! Name" lines ----
function parseHeaders(text) {
  const rules = [];
  for (const raw of text.split('\n')) {
    if (!raw.trim() || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      // A splat matches anything greedily; a :placeholder matches up to the next slash.
      const pattern = raw.trim().replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/:\w+/g, '[^/]+');
      rules.push({ match: new RegExp(`^${pattern}$`), set: [], detach: [] });
      continue;
    }
    const rule = rules.at(-1);
    const line = raw.trim();
    if (line.startsWith('! ')) rule.detach.push(line.slice(2).trim().toLowerCase());
    else {
      const colon = line.indexOf(':');
      rule.set.push([line.slice(0, colon).trim(), line.slice(colon + 1).trim()]);
    }
  }
  return rules;
}
const headersFile = headersOverride ? resolve(headersOverride) : join(root, '_headers');
const rules = existsSync(headersFile) ? parseHeaders(readFileSync(headersFile, 'utf8')) : [];
if (!rules.length) console.warn(`serve: no rules in ${headersFile}; serving without security headers`);

function headersFor(pathname) {
  const out = new Map();
  for (const rule of rules.filter((r) => r.match.test(pathname))) {
    for (const [name, value] of rule.set) {
      const key = name.toLowerCase();
      out.set(key, out.has(key) ? [out.get(key)[0], `${out.get(key)[1]}, ${value}`] : [name, value]);
    }
  }
  for (const rule of rules.filter((r) => r.match.test(pathname))) rule.detach.forEach((key) => out.delete(key));
  return Object.fromEntries(out.values());
}

// ---- routing, as Cloudflare Pages resolves static assets ----
const isFile = (path) => existsSync(path) && statSync(path).isFile();

function route(pathname) {
  const local = normalize(join(root, pathname));
  if (local !== root && !local.startsWith(root + sep)) return { status: 404 };
  if (/(^|\/)_(headers|redirects)$/.test(pathname)) return { status: 404 };
  if (pathname.endsWith('/index.html')) return { redirect: pathname.slice(0, -'index.html'.length) };
  if (pathname.endsWith('.html')) return { redirect: pathname.slice(0, -'.html'.length) };
  if (pathname.endsWith('/')) {
    if (isFile(join(local, 'index.html'))) return { file: join(local, 'index.html') };
    if (pathname !== '/' && isFile(`${local}.html`)) return { redirect: pathname.slice(0, -1) };
    return { status: 404 };
  }
  if (isFile(local)) return { file: local };
  if (isFile(join(local, 'index.html'))) return { redirect: `${pathname}/` };
  if (isFile(`${local}.html`)) return { file: `${local}.html` };
  return { status: 404 };
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || host}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    pathname = '/__bad_request__';
  }
  const found = route(pathname);
  if (found.redirect) {
    res.writeHead(308, { Location: found.redirect + url.search });
    return res.end();
  }
  const status = found.file ? 200 : 404;
  const file = found.file || join(root, '404.html');
  const head = { ...headersFor(pathname) };
  if (!isFile(file)) {
    res.writeHead(404, { ...head, 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Not found\n');
  }
  res.writeHead(status, { ...head, 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Content-Length': statSync(file).size });
  if (req.method === 'HEAD') return res.end();
  createReadStream(file).pipe(res);
});

server.listen(port, host, () => console.log(`serve: ${root} on http://${host}:${port}/`));
