# Svaion Technologies website

The svaiontech.com homepage: Next.js 16 and TypeScript, organized with domain-driven design, exported as static files.

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # domain rules and copy parity (Vitest)
npm run lint       # includes the layer rule below
npm run typecheck
npm run build      # static site in out/; deploy that folder to any CDN host
npm run preview    # serve out/ on http://127.0.0.1:4173
npm run parity     # with preview running: diff the build against reference/ (needs Chromium and ImageMagick)
```

## Where things live

```
src/
  contexts/            Bounded contexts: plain TypeScript, no React or Next.js
    company/           names, legal notice, tagline, approved messages, contact channels
    offering/          service lines, audience segments, MVP window, engagement commitments
    delivery/          the Discover → Build → Launch → Support path; accountability rules
    showcase/          illustrative scenarios of AI-assisted, human-led work
    shared/            invariant() and series formatting
  application/
    homepage/          getHomepage(): words every section from the contexts (the read model)
  ui/                  markup and motion only; renders the homepage view
    sections/ brand/ behavior/ styles/globals.css
  app/                 Next.js routes, metadata, icons
reference/homepage-v9.html   the approved design; the build must match it
GLOSSARY-MAP.md              the ubiquitous language, one glossary per context
docs/adr/                    why it is built this way
```

Dependencies point one way: `app → ui → application → contexts`. ESLint rejects imports that go backward (`npm run lint`).

## Changing content

- A fact (an email, the MVP window, a service line, a scenario) changes in its context, once. Every sentence that uses it updates with it.
- Section headings and button labels are in `src/application/homepage/copy.ts`. Approved messages and headings need CEO and COO sign-off, scenarios and AI claims need the CTO's.
- Domain rules run at build time. The AI can never be an accountable person, every assistant draft must disclose itself, scenarios are always illustrative, and contact channels stay on svaiontech.com. Breaking one fails `npm run build` and `npm test`.
- The copy-parity test checks that every string on the page appears in `reference/homepage-v9.html`. When the approved design changes, update the reference first.

## Deploying

`npm run build` writes plain HTML, CSS, and JavaScript to `out/`. Point Cloudflare Pages, Netlify, or S3 with CloudFront at it. There is no server and no database (docs/adr/0002). The four mailboxes (hello@, sales@, support@, privacy@) must exist, because every call to action is an email.
