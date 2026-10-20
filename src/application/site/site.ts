import { mailto, registrationNotice, siteUrl, type ContactChannel } from "@/contexts/company/model";
import { svaion } from "@/contexts/company/svaion";
import { siteCopy } from "./copy";
import type { EmailLink, Link, SiteChromeView, SiteMeta } from "./view";

/** Every page of the site. Paths end in a slash, matching how the static export writes them. */
export const routes = { home: "/", privacy: "/privacy/" } as const;

/** The homepage links to its own sections; every other page links back into it. */
export type Placement = "homepage" | "subpage";

export function emailLink(channel: ContactChannel): EmailLink {
  return { address: channel.address, href: mailto(channel) };
}

/** A section link that works from wherever it is placed. */
export function sectionLink(link: Link, placement: Placement): Link {
  return placement === "homepage" ? link : { ...link, href: `${routes.home}${link.href}` };
}

export function getSiteMeta(): SiteMeta {
  return { siteUrl: siteUrl(svaion), siteName: svaion.presentationName, themeColor: siteCopy.themeColor };
}

export function getSiteChrome(placement: Placement, year = new Date().getFullYear()): SiteChromeView {
  const { channels } = svaion;
  const links = siteCopy.nav.links.map((link) => sectionLink(link, placement));
  return {
    skipLink: siteCopy.skipLink,
    nav: {
      homeHref: placement === "homepage" ? "#top" : routes.home,
      homeLabel: siteCopy.nav.homeLabel,
      navLabel: siteCopy.nav.navLabel,
      menuOpenLabel: siteCopy.nav.menuOpenLabel,
      menuCloseLabel: siteCopy.nav.menuCloseLabel,
      links,
      cta: sectionLink(siteCopy.startProject, placement),
      email: emailLink(channels.general),
    },
    footer: {
      name: svaion.presentationName,
      descriptor: svaion.descriptor,
      site: { label: svaion.domain, href: siteUrl(svaion) },
      emailHeading: siteCopy.footer.emailHeading,
      emails: [channels.general, channels.sales, channels.support, channels.privacy].map(emailLink),
      linksHeading: svaion.shortName,
      links,
      social: `Social: ${svaion.socialHandle}`,
      privacy: { label: siteCopy.footer.privacyLink, href: routes.privacy },
      legalNotice: registrationNotice(svaion),
      copyright: `© ${year} ${svaion.shortName} · ${svaion.domain}`,
    },
  };
}

/** Absolute addresses of the pages search engines should index. */
export function getSitemap(): readonly string[] {
  return Object.values(routes).map((path) => `${siteUrl(svaion)}${path}`);
}
