#!/usr/bin/env node
// Docker image build: turns out/_headers (Cloudflare Pages format, written by
// tools/headers/write-headers.mjs) into nginx location blocks, so the container sends exactly the
// headers Cloudflare would. One source of truth for headers, two hosts.
// usage: node tools/docker/nginx-locations.mjs out/_headers > locations.conf
//
// Cloudflare applies every rule whose path matches; nginx gives a request one location and drops
// server-level add_header inside any location that has its own. So each location here restates
// every header that applies to it. Only "/*" and "/prefix/*" rules are supported; anything else
// fails the image build rather than ship different headers than Cloudflare would.
import { readFileSync } from 'node:fs';

const file = process.argv[2] || 'out/_headers';

// Cloudflare Pages' default for files without their own Cache-Control: revalidate every time.
const DEFAULT_CACHE_CONTROL = 'public, max-age=0, must-revalidate';

const fail = (message) => {
  console.error(`nginx-locations: ${message}`);
  process.exit(1);
};

const rules = [];
for (const [index, line] of readFileSync(file, 'utf8').split('\n').entries()) {
  if (!line.trim() || line.trimStart().startsWith('#')) continue;
  if (!/^\s/.test(line)) {
    rules.push({ pattern: line.trim(), headers: [] });
    continue;
  }
  const match = /^\s+([A-Za-z0-9-]+):\s*(.+)$/.exec(line);
  if (!match || !rules.length) fail(`line ${index + 1} is not "  Name: value" under a path: ${line}`);
  if (/["\\$]/.test(match[2])) fail(`${match[1]} contains a quote, backslash, or $, which nginx would misread`);
  rules.at(-1).headers.push([match[1], match[2]]);
}

const prefixOf = ({ pattern }) => {
  if (pattern === '/*') return '/';
  if (/^(\/[A-Za-z0-9._-]+)+\/\*$/.test(pattern)) return pattern.slice(0, -1);
  fail(`unsupported path rule ${pattern}; only /* and /prefix/* map onto nginx locations`);
};

const locations = [...new Set(rules.map(prefixOf))].sort();
if (!locations.includes('/')) locations.unshift('/');

for (const location of locations) {
  const headers = rules.filter((rule) => location.startsWith(prefixOf(rule))).flatMap((rule) => rule.headers);
  const names = headers.map(([name]) => name.toLowerCase());
  if (new Set(names).size !== names.length) fail(`two rules set the same header for ${location}`);
  if (!names.includes('cache-control')) headers.push(['Cache-Control', DEFAULT_CACHE_CONTROL]);

  console.log(`location ${location === '/' ? '/' : `^~ ${location}`} {`);
  for (const [name, value] of headers) console.log(`    add_header ${name} "${value}" always;`);
  console.log('    try_files $uri $uri/ =404;');
  console.log('}');
}
