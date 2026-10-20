import { mailto } from "@/contexts/company/model";
import { svaion } from "@/contexts/company/svaion";
import { getSiteChrome, routes } from "../site/site";
import type { Link, PageMeta, SiteChromeView } from "../site/view";

/** Wording for the 404 page. Changes need the same CEO and COO sign-off as the homepage copy. */
const copy = {
  code: "404",
  heading: "Page not found.",
  lede: "The link may be out of date, or the address may have a typo. Everything Svaion offers starts on the homepage.",
  home: "Back to the homepage",
  email: "Email us",
} as const;

export interface NotFoundView extends SiteChromeView {
  readonly meta: PageMeta;
  readonly page: {
    readonly code: string;
    readonly heading: string;
    readonly lede: string;
    readonly home: Link;
    readonly email: Link;
  };
}

export function getNotFound(year?: number): NotFoundView {
  return {
    ...getSiteChrome("subpage", year),
    meta: { title: `${copy.heading.slice(0, -1)} — ${svaion.presentationName}`, description: copy.lede },
    page: {
      code: copy.code,
      heading: copy.heading,
      lede: copy.lede,
      home: { label: copy.home, href: routes.home },
      email: { label: copy.email, href: mailto(svaion.channels.general) },
    },
  };
}
