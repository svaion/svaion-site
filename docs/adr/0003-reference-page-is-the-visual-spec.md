# The approved reference page is the visual spec

`reference/homepage-v10.html` is the design the founders approved (v9) plus a Privacy notice link in the footer's legal row; the Next.js homepage must match it pixel for pixel. Its stylesheet is ported verbatim into `src/ui/styles/globals.css` as one global sheet, with a single change: `--font-sans` leads with the self-hosted Inter from `next/font`. Components keep the reference's class names and markup so the sheet applies unchanged. Parity is checked by rendering both pages at the same widths and animation times and comparing the images.

A homepage design change lands in the reference first, then in `globals.css` and the components. Pages the reference doesn't cover (404, privacy notice) reuse its classes and keep their own styles in `additions.css` and `prose.css`, so `globals.css` stays a verbatim port.

## Considered Options

- Tailwind or CSS Modules: idiomatic for Next.js, but a rewrite of 400 lines of tuned CSS is where visual drift would come from. Revisit once parity checks run in CI and the design starts changing.
