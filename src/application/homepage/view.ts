import type { ServiceLineId } from "@/contexts/offering/model";

export type { ServiceLineId };

/** Everything the homepage renders, already worded. The UI adds markup and motion, never words. */
export interface HomepageView {
  readonly skipLink: string;
  readonly meta: {
    readonly title: string;
    readonly description: string;
    readonly canonicalUrl: string;
    readonly siteName: string;
    readonly shareDescription: string;
    readonly themeColor: string;
  };
  readonly nav: {
    readonly homeLabel: string;
    readonly navLabel: string;
    readonly menuOpenLabel: string;
    readonly menuCloseLabel: string;
    readonly links: readonly Link[];
    readonly cta: Link;
    readonly email: EmailLink;
  };
  readonly hero: {
    readonly kicker: readonly string[];
    readonly kickerSentence: string;
    readonly headline: string;
    readonly subheadline: string;
    readonly primaryCta: Link;
    readonly secondaryCta: Link;
    readonly note: string;
    readonly drawingTitle: string;
    readonly drawingCaption: string;
  };
  readonly demo: {
    readonly tagline: string;
    readonly intro: string;
    readonly tablistLabel: string;
    readonly scenarios: readonly ScenarioView[];
    readonly notice: string;
  };
  readonly contact: {
    readonly lead: string;
    readonly email: EmailLink;
    readonly heading: string;
    readonly primaryCta: Link;
    readonly secondaryCta: Link;
  };
  readonly audience: {
    readonly heading: string;
    readonly summary: string;
    readonly listLabel: string;
    readonly segments: readonly { readonly name: string; readonly benefit: string }[];
  };
  readonly engagement: {
    readonly heading: string;
    readonly paragraphs: readonly string[];
    readonly planLabel: string;
    readonly planWindow: string;
    readonly planNote: string;
    readonly commitments: readonly string[];
    readonly cta: Link;
  };
  readonly process: {
    readonly heading: string;
    readonly intro: string;
    readonly stages: readonly { readonly name: string; readonly description: string }[];
  };
  readonly services: {
    readonly heading: string;
    readonly intro: string;
    readonly lines: readonly { readonly id: ServiceLineId; readonly name: string; readonly summary: string }[];
  };
  readonly ledger: {
    readonly heading: string;
    readonly intro: string;
    readonly columns: readonly [aiActivity: string, accountablePerson: string];
    readonly rules: readonly { readonly aiActivity: string; readonly accountablePerson: string }[];
  };
  readonly faq: {
    readonly heading: string;
    readonly contactLabel: string;
    readonly email: EmailLink;
    readonly proposalsNote: string;
    readonly questions: readonly { readonly question: string; readonly answer: string }[];
  };
  readonly closing: {
    readonly heading: string;
    readonly cta: Link;
  };
  readonly footer: {
    readonly name: string;
    readonly descriptor: string;
    readonly site: Link;
    readonly emailHeading: string;
    readonly emails: readonly EmailLink[];
    readonly linksHeading: string;
    readonly links: readonly Link[];
    readonly social: string;
    readonly legalNotice: string | null;
    readonly copyright: string;
  };
}

export interface Link {
  readonly label: string;
  readonly href: string;
}

export interface EmailLink {
  readonly address: string;
  readonly href: string;
}

export interface ScenarioView {
  readonly id: string;
  readonly label: string;
  readonly request: string;
  readonly draft: string;
  readonly disclosure: string;
  readonly signOff: string;
}
