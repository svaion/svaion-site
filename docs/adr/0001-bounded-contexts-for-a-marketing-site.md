# Bounded contexts for a marketing site

The homepage repeats the same facts in many places: the MVP window appears five times, the audience twice, the service lines three times, the mailboxes in running sentences. Before this structure, edits drifted between copies. We model those facts once, in four bounded contexts (Company, Offering, Delivery, Showcase) written as plain TypeScript with no React or Next.js, and let a single read model (`src/application/homepage`) word them for the page. Brand rules from the guidelines become invariants the build enforces: the AI is never the accountable person, every assistant draft discloses itself, scenarios are always illustrative, and contact channels stay on the company domain.

Layering, enforced by ESLint `no-restricted-imports`: `app` (routes) → `ui` (markup and motion, no words of its own) → `application` (composition) → `contexts` (domain). Content lives as code inside each context; a CMS, if one comes, replaces those content modules behind the same types rather than reaching into the UI.

## Considered Options

- Copy written straight into React components: fewer files, but it is the arrangement that let the duplicates drift.
- A headless CMS now: lets non-developers edit, but adds a vendor and a build-time dependency for a site that changes rarely, and loses the invariants.
