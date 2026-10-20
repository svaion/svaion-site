export interface Link {
  readonly label: string;
  readonly href: string;
}

export interface EmailLink {
  readonly address: string;
  readonly href: string;
}

/** What the site says about itself, for every page's head. */
export interface SiteMeta {
  readonly siteUrl: string;
  readonly siteName: string;
  readonly themeColor: string;
}

/** One page's head. Pages without a path, like the 404, have no canonical address. */
export interface PageMeta {
  readonly title: string;
  readonly description: string;
  readonly path?: string;
  readonly shareDescription?: string;
}

/** The frame every page shares, already worded. */
export interface SiteChromeView {
  readonly skipLink: string;
  readonly nav: NavView;
  readonly footer: FooterView;
}

export interface NavView {
  readonly homeHref: string;
  readonly homeLabel: string;
  readonly navLabel: string;
  readonly menuOpenLabel: string;
  readonly menuCloseLabel: string;
  readonly links: readonly Link[];
  readonly cta: Link;
  readonly email: EmailLink;
}

export interface FooterView {
  readonly name: string;
  readonly descriptor: string;
  readonly site: Link;
  readonly emailHeading: string;
  readonly emails: readonly EmailLink[];
  readonly linksHeading: string;
  readonly links: readonly Link[];
  readonly social: string;
  readonly privacy: Link;
  readonly legalNotice: string | null;
  readonly copyright: string;
}
