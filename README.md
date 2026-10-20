# Svaion Technologies website

svaiontech.com: Next.js 16 and TypeScript, organized with domain-driven design, exported as static files.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # domain rules and copy parity (Vitest)
npm run lint       # includes the layer rule below
npm run typecheck
npm run build      # static site in out/, with security headers (see Deploying)
npm run preview    # serve out/ the way Cloudflare Pages does, on http://127.0.0.1:4173
npm run parity     # with preview running: diff the homepage against reference/ (needs Chromium and ImageMagick)
npm run check:csp  # with preview running: load every page in Chromium; fails on a CSP violation or broken behaviour
```

## Docker

The same site in a container, with nothing to install but Docker:

```bash
docker compose up --build -d     # build, test, and serve on http://localhost:8080
docker compose down              # stop it
docker build --target export --output type=local,dest=out .   # only the static files, built in the container
```

- The image pins Node.js 26.8.1 and runs `npm test` before `npm run build`, so a broken domain rule fails the image instead of shipping.
- nginx serves the files with the same headers, redirects, and 404s as Cloudflare Pages. `tools/docker/nginx-locations.mjs` turns `out/_headers` into nginx config, so headers are still defined once, in `tools/headers/write-headers.mjs`.
- To check a running container: `node tools/headers/check-csp.mjs http://127.0.0.1:8080`.
- The container runs as a non-root user with a read-only filesystem, bound to this machine only.
- On a server, put TLS in front (Cloudflare or a reverse proxy). Rebuild monthly with `docker compose build --pull` to pick up nginx and Alpine security fixes.

## Pages

- `/`: the homepage
- `/privacy/`: the privacy notice
- `404.html`: served for any unknown address
- `robots.txt`, `sitemap.xml`, and the link-preview image at `/opengraph-image/share.png`

## Where things live

```
src/
  contexts/            Bounded contexts: plain TypeScript, no React or Next.js
    company/           names, legal notice, tagline, approved messages, contact channels
    offering/          service lines, audience segments, MVP window, engagement commitments
    delivery/          the Discover → Build → Launch → Support path; accountability rules
    showcase/          illustrative scenarios of AI-assisted, human-led work
    privacy/           personal data, purposes, retention, and rights under the Data Privacy Act of 2012
    shared/            invariant() and series formatting
  application/         read models: each page's words, composed from the contexts
    site/              the nav, footer, and routes every page shares
    homepage/ privacy/ not-found/ share/
  ui/                  markup and motion only; renders the views
    SiteFrame.tsx sections/ brand/ behavior/ styles/
  assets/              fonts and logo used only at build time, for the share image
  app/                 Next.js routes, metadata, icons
reference/homepage-v10.html  the approved homepage design; the build must match it
GLOSSARY-MAP.md              the ubiquitous language, one glossary per context
docs/adr/                    why it is built this way
tools/                       parity, security headers, the preview server, and nginx config for Docker
Dockerfile, compose.yaml     the container build (see Docker)
```

Dependencies point one way: `app → ui → application → contexts`. ESLint rejects imports that go backward (`npm run lint`).

## Changing content

- A fact (an email, the MVP window, a service line, a scenario, a retention period) changes in its context, once. Every sentence that uses it updates with it.
- Headings and button labels are in each page's `copy.ts` under `src/application/`. Approved messages and headings need CEO and COO sign-off, scenarios and AI claims need the CTO's, and the privacy notice also needs legal review.
- Domain rules run at build time. Breaking one fails `npm run build` and `npm test`. The rules:
  - the AI can never be an accountable person;
  - every assistant draft must disclose itself;
  - scenarios are always illustrative;
  - contact channels stay on svaiontech.com;
  - the privacy notice lists every right under the Act and declares anything the website collects.
- The copy-parity test checks that every string on the homepage appears in `reference/homepage-v10.html`. When the approved design changes, update the reference first (docs/adr/0003).

## Deploying

`npm run build` writes plain HTML, CSS, and JavaScript to `out/`. There is no server and no database (docs/adr/0002).

On Cloudflare Pages, use:
- build command `npm run build`;
- output directory `out`;
- Node.js 20.9 or later.

Netlify works the same way. To build without Node.js installed, use the Docker export command above and upload `out/`. To host it yourself, run the container (see Docker).

The four mailboxes (hello@, sales@, support@, privacy@) must exist, because every call to action is an email.

The build also runs `tools/headers/write-headers.mjs`. It does two things:
- It writes `out/_headers`, with security headers and long caching for `/_next/static/*`. Cloudflare Pages and Netlify read this file.
- It gives every page a Content-Security-Policy `<meta>` that lists the hashes of that page's own inline scripts.

To change a header, edit that script, never `out/_headers`. On S3 or CloudFront, set the `_headers` values as response headers on the distribution yourself.

In the Cloudflare dashboard for svaiontech.com:
- **Email Address Obfuscation: off.** It rewrites the mailto links, and every call to action is one.
- **Rocket Loader: off.** It rewrites script tags, which breaks the script hashes.
- **Web Analytics auto-injection: off,** unless the CSP and the privacy notice are updated for it.
- **HSTS:** already sent by `_headers`. Don't add includeSubDomains or preload in the zone settings.
