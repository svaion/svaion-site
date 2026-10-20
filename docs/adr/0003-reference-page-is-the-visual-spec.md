# The approved reference page is the visual spec

`reference/homepage-v9.html` is the design the founders approved; the Next.js build must match it pixel for pixel. Its stylesheet is ported verbatim into `src/ui/styles/globals.css` as one global sheet, with a single change: `--font-sans` leads with the self-hosted Inter from `next/font`. Components keep the reference's class names and markup so the sheet applies unchanged. Parity is checked by rendering both pages at the same widths and animation times and comparing the images.

## Considered Options

- Tailwind or CSS Modules: idiomatic for Next.js, but a rewrite of 400 lines of tuned CSS is where visual drift would come from. Revisit once parity checks run in CI and the design starts changing.
