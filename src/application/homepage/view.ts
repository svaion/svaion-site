import type { ServiceLineId } from "@/contexts/offering/model";
import type { EmailLink, Link, PageMeta, SiteChromeView } from "../site/view";

export type { EmailLink, Link, ServiceLineId };

/** Everything the homepage renders, already worded. The UI adds markup and motion, never words. */
export interface HomepageView extends SiteChromeView {
  readonly meta: PageMeta;
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
  };
}

export interface ScenarioView {
  readonly id: string;
  readonly label: string;
  readonly request: string;
  readonly draft: string;
  readonly disclosure: string;
  readonly signOff: string;
}
