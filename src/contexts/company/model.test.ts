import { describe, expect, it } from "vitest";
import { DomainError } from "../shared/invariant";
import { defineCompany, mailto, registrationNotice, type Company } from "./model";
import { svaion } from "./svaion";

describe("Company", () => {
  it("carries the SEC notice while the legal name is proposed", () => {
    expect(registrationNotice(svaion)).toBe("SVAION TECHNOLOGIES, INC. — proposed corporate name, subject to SEC approval.");
  });

  it("drops the notice once the legal name is registered", () => {
    const registered: Company = { ...svaion, registration: { kind: "registered", secNumber: "CS202600000" } };
    expect(registrationNotice(defineCompany(registered))).toBeNull();
  });

  it("keeps every contact channel on the company domain", () => {
    const offDomain = { ...svaion, channels: { ...svaion.channels, sales: { purpose: "sales", address: "svaion@gmail.com" } } } as Company;
    expect(() => defineCompany(offDomain)).toThrow(DomainError);
  });

  it("encodes a subject into a mailto link", () => {
    expect(mailto(svaion.channels.general, "New project")).toBe("mailto:hello@svaiontech.com?subject=New%20project");
  });
});
