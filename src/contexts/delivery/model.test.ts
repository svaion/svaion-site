import { describe, expect, it } from "vitest";
import { DomainError } from "../shared/invariant";
import { defineAccountability, definePath } from "./model";
import { deliveryPath } from "./practice";

describe("Delivery", () => {
  it("runs Discover, Build, Launch, Support, in that order", () => {
    expect(deliveryPath.map((stage) => stage.name)).toEqual(["Discover", "Build", "Launch", "Support"]);
    expect(() => definePath([...deliveryPath].reverse())).toThrow(DomainError);
  });

  it("puts the MVP window in the Launch stage", () => {
    expect(deliveryPath[2].description).toContain("approximately 8–12 weeks");
  });

  it("never lets the AI answer for its own work", () => {
    expect(() => defineAccountability([{ aiActivity: "Merges code", accountablePerson: "The AI merges it after tests pass." }])).toThrow(DomainError);
    expect(() => defineAccountability([{ aiActivity: "Merges code", accountablePerson: " " }])).toThrow(DomainError);
  });
});
