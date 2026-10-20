/**
 * Wording every page shares: the skip link, nav, footer, and the main call to action.
 * Same sign-off as the homepage copy.
 */
export const siteCopy = {
  skipLink: "Skip to content",
  nav: {
    homeLabel: "Svaion home",
    navLabel: "Main",
    menuOpenLabel: "Open menu",
    menuCloseLabel: "Close menu",
    links: [
      { label: "Services", href: "#services" },
      { label: "How we work", href: "#how" },
      { label: "Who it's for", href: "#for" },
      { label: "FAQs", href: "#faq" },
    ],
  },
  startProject: { label: "Start a project", href: "#contact" },
  footer: {
    emailHeading: "Email",
    privacyLink: "Privacy notice",
  },
  /** Midnight, the brand ground; colors the browser chrome on mobile. */
  themeColor: "#0B1020",
} as const;
