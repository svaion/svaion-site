import { describe, expect, it } from "vitest";
import { svaion } from "../company/svaion";
import { DomainError } from "../shared/invariant";
import { collectsNothing, DATA_SUBJECT_RIGHTS, definePrivacyNotice, type PrivacyNotice } from "./model";
import { privacyNotice } from "./notice";

const define = (changes: Partial<PrivacyNotice>) => () => definePrivacyNotice(svaion, { ...privacyNotice, ...changes });

describe("Privacy", () => {
  it("names the company's legal name as the personal information controller", () => {
    expect(privacyNotice.controller).toBe("SVAION TECHNOLOGIES, INC.");
    expect(define({ controller: "Svaion Technologies" })).toThrow(DomainError);
  });

  it("sends privacy questions to the privacy channel only", () => {
    expect(privacyNotice.contact.address).toBe("privacy@svaiontech.com");
    expect(define({ contact: svaion.channels.sales })).toThrow(DomainError);
  });

  it("lists every data subject right under the Act, in order", () => {
    expect(privacyNotice.rights.map((right) => right.id)).toEqual([...DATA_SUBJECT_RIGHTS]);
    expect(define({ rights: privacyNotice.rights.filter((right) => right.id !== "portability") })).toThrow(DomainError);
  });

  it("declares everything the website collects; today it collects nothing", () => {
    expect(collectsNothing(privacyNotice.website)).toBe(true);
    expect(define({ website: { ...privacyNotice.website, analytics: [{ name: "Page counter", purpose: " " }] } })).toThrow(DomainError);
  });

  it("says how AI tools touch personal data, with a person reviewing their output", () => {
    expect(define({ ai: { ...privacyNotice.ai, tasks: [] } })).toThrow(DomainError);
    expect(define({ ai: { ...privacyNotice.ai, review: "The AI checks its own drafts." } })).toThrow(DomainError);
    expect(define({ processors: privacyNotice.processors.filter((processor) => processor.kind !== "ai") })).toThrow(DomainError);
  });

  it("gives every processing activity a purpose, a lawful basis, and a retention period", () => {
    const [visit, email] = privacyNotice.activities;
    expect(define({ activities: [visit, { ...email, lawfulBases: [] }] })).toThrow(DomainError);
    expect(define({ activities: [{ ...visit, retention: [] }, email] })).toThrow(DomainError);
  });

  it("leaves the Data Protection Officer unnamed rather than blank", () => {
    expect(define({ dataProtectionOfficer: { name: " " } })).toThrow(DomainError);
    expect(define({ dataProtectionOfficer: { name: "Maria Santos" } })).not.toThrow();
  });
});
