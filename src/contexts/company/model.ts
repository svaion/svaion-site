import { invariant } from "../shared/invariant";

export type ChannelPurpose = "general" | "sales" | "support" | "privacy";

export interface ContactChannel {
  readonly purpose: ChannelPurpose;
  readonly address: string;
}

export type RegistrationStatus = { readonly kind: "proposed" } | { readonly kind: "registered"; readonly secNumber: string };

export interface Company {
  readonly shortName: string;
  readonly presentationName: string;
  readonly legalName: string;
  readonly registration: RegistrationStatus;
  readonly domain: string;
  /** One sentence on what the company is, for search results and link previews. */
  readonly positioning: string;
  readonly descriptor: string;
  readonly tagline: string;
  readonly headline: string;
  readonly subheadline: string;
  readonly channels: Readonly<Record<ChannelPurpose, ContactChannel>>;
  readonly socialHandle: string;
}

export function defineCompany(company: Company): Company {
  invariant(company.legalName === company.legalName.toUpperCase(), "The legal name is written in capitals.");
  for (const [purpose, channel] of Object.entries(company.channels)) {
    invariant(channel.purpose === purpose, `The ${purpose} channel is filed under the wrong purpose.`);
    invariant(channel.address.endsWith(`@${company.domain}`), `The ${purpose} channel must be a mailbox on ${company.domain}.`);
  }
  invariant(company.socialHandle.startsWith("@"), "A social handle starts with @.");
  return Object.freeze(company);
}

/** The line that must accompany the legal name until the SEC approves it; none once registered. */
export function registrationNotice(company: Company): string | null {
  return company.registration.kind === "proposed"
    ? `${company.legalName} — proposed corporate name, subject to SEC approval.`
    : null;
}

export function siteUrl(company: Company): string {
  return `https://${company.domain}`;
}

export function mailto(channel: ContactChannel, subject?: string): string {
  return subject ? `mailto:${channel.address}?subject=${encodeURIComponent(subject)}` : `mailto:${channel.address}`;
}
