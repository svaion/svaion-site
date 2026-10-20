# Static export, with no server and no database

The site is built with `output: "export"` and deployed as plain files to a CDN host (Cloudflare Pages, Netlify, or S3 with CloudFront). Every call to action is an email link to a contact channel, so nothing is submitted, stored, or personalized, and a server would only add cost, patching, and an attack surface.

## Consequences

Route handlers that read requests, redirects, rewrites, headers, the image optimizer, and `use cache` are unavailable. Adding a contact form, client logins, or anything that stores personal data means revisiting this decision, and also triggers Philippine Data Privacy Act duties (a privacy notice, and a decision on where submissions live and for how long).

The Docker image doesn't change this. It is nginx serving the same files, with no application code running, so the site stays the same whether it is on a CDN or in the container. A CDN host remains the default. Self-hosting the container brings back two of the costs above: terminating TLS in front of it, and rebuilding it to pick up nginx and Alpine patches.
