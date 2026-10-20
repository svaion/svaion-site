import type { Company, ContactChannel } from "../company/model";
import { invariant } from "../shared/invariant";

export const ACT = { name: "Data Privacy Act of 2012", citation: "Republic Act No. 10173" } as const;

export const REGULATOR = { name: "National Privacy Commission", site: "https://privacy.gov.ph" } as const;

/** Every right the Act gives a data subject, in the order a notice lists them. */
export const DATA_SUBJECT_RIGHTS = ["informed", "object", "access", "rectification", "erasure", "damages", "portability", "complaint"] as const;
export type DataSubjectRightId = (typeof DATA_SUBJECT_RIGHTS)[number];

export interface DataSubjectRight {
  readonly id: DataSubjectRightId;
  readonly name: string;
  readonly description: string;
}

/** What the website itself puts on a visitor's device or sends to another company. */
export const COLLECTION_KINDS = ["cookies", "analytics", "forms", "thirdParty"] as const;
export type CollectionKind = (typeof COLLECTION_KINDS)[number];

export interface CollectedItem {
  readonly name: string;
  readonly purpose: string;
}

export type WebsiteCollection = Readonly<Record<CollectionKind, readonly CollectedItem[]>>;

export type ProcessorKind = "hosting" | "email" | "ai";

export interface Processor {
  readonly kind: ProcessorKind;
  readonly service: string;
  readonly role: string;
}

export type LawfulBasisKind = "pre-contract" | "contract" | "legitimate-interest";

export interface LawfulBasis {
  readonly kind: LawfulBasisKind;
  readonly statement: string;
}

export interface RetentionRule {
  readonly applies: string;
  readonly period: string;
}

export interface ProcessingActivity {
  readonly id: "visit" | "email";
  readonly personalData: readonly string[];
  readonly purposes: readonly string[];
  readonly lawfulBases: readonly LawfulBasis[];
  readonly retention: readonly RetentionRule[];
  readonly processors: readonly ProcessorKind[];
}

export interface AiUse {
  readonly tasks: readonly string[];
  readonly review: string;
  readonly training: string;
  /** AI-assisted, human-led: no AI tool decides anything about a data subject on its own. */
  readonly decidesAlone: false;
}

export interface PrivacyNotice {
  readonly controller: string;
  readonly contact: ContactChannel;
  readonly dataProtectionOfficer: { readonly name: string | null };
  /** ISO date, YYYY-MM-DD. */
  readonly lastUpdated: string;
  readonly website: WebsiteCollection;
  readonly activities: readonly ProcessingActivity[];
  readonly ai: AiUse;
  readonly processors: readonly Processor[];
  readonly sellsPersonalData: false;
  readonly transfersAbroad: boolean;
  readonly rights: readonly DataSubjectRight[];
}

const NAMES_THE_AI = /^(the |an? )?AI\b/i;

export function definePrivacyNotice(company: Company, notice: PrivacyNotice): PrivacyNotice {
  invariant(notice.controller === company.legalName, "The personal information controller is the company's legal name.");
  invariant(notice.contact === company.channels.privacy, "Privacy questions go to the privacy contact channel.");
  invariant(notice.dataProtectionOfficer.name === null || notice.dataProtectionOfficer.name.trim(), "A Data Protection Officer is named, or left unnamed, never blank.");
  invariant(/^\d{4}-\d{2}-\d{2}$/.test(notice.lastUpdated) && !Number.isNaN(Date.parse(notice.lastUpdated)), "The notice carries the date it was last updated.");

  for (const kind of COLLECTION_KINDS) {
    for (const item of notice.website[kind]) {
      invariant(item.name.trim() && item.purpose.trim(), `Every ${kind} item the website uses is named, with its purpose.`);
    }
  }

  const declared = new Set(notice.processors.map((processor) => processor.kind));
  invariant(declared.size === notice.processors.length, "Each processor is listed once.");
  for (const activity of notice.activities) {
    invariant(activity.personalData.length > 0, `The ${activity.id} activity says what personal data it handles.`);
    invariant(activity.purposes.length > 0, `The ${activity.id} activity says why.`);
    invariant(activity.lawfulBases.length > 0, `The ${activity.id} activity has a lawful basis.`);
    invariant(activity.retention.length > 0, `The ${activity.id} activity says how long its data is kept.`);
    for (const kind of activity.processors) invariant(declared.has(kind), `The ${activity.id} activity uses an undeclared ${kind} processor.`);
  }
  invariant(new Set(notice.activities.map((activity) => activity.id)).size === notice.activities.length, "Each processing activity is described once.");

  invariant(notice.ai.tasks.length > 0 && notice.ai.review.trim() && notice.ai.training.trim(), "The notice says how AI tools touch personal data.");
  invariant(declared.has("ai"), "AI tools that touch personal data are listed as a processor.");
  invariant(!NAMES_THE_AI.test(notice.ai.review), "A person, not the AI, reviews what an AI tool produces.");

  invariant(notice.rights.map((right) => right.id).join() === DATA_SUBJECT_RIGHTS.join(), "The notice lists every data subject right under the Act, in order.");
  invariant(notice.rights.every((right) => right.name.trim() && right.description.trim()), "Every data subject right says what it lets a person do.");

  return Object.freeze(notice);
}

/** True when the website stores nothing on a device and sends nothing to another company. */
export function collectsNothing(website: WebsiteCollection): boolean {
  return COLLECTION_KINDS.every((kind) => website[kind].length === 0);
}
