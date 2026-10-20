import { describe, expect, it } from "vitest";
import { DomainError } from "../shared/invariant";
import { defineScenarios } from "./model";
import { scenarios } from "./scenarios";

describe("Showcase", () => {
  it("discloses AI assistance on every assistant draft", () => {
    const [quote] = scenarios;
    expect(() => defineScenarios([{ ...quote, draft: { ...quote.draft, disclosure: "Source: Price list 2026." } }])).toThrow(DomainError);
  });

  it("ends every scenario with a person's sign-off", () => {
    expect(() => defineScenarios([{ ...scenarios[0], signOff: "" }])).toThrow(DomainError);
  });

  it("keeps the three approved scenarios", () => {
    expect(scenarios.map((s) => s.label)).toEqual(["Draft a quote", "Route a request", "Answer from documents"]);
  });
});
