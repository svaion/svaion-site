import { describe, expect, it } from "vitest";
import { DomainError } from "../shared/invariant";
import { offering } from "./catalog";
import { audienceSeries, defineOffering, formatWeeks, serviceLineSeries, timingMessage, weekRange } from "./model";

describe("Offering", () => {
  it("states the MVP window as the approved timing message", () => {
    expect(timingMessage(offering.mvpWindow)).toBe("Launch a focused MVP in approximately 8–12 weeks, depending on scope.");
  });

  it("writes week ranges with an en dash", () => {
    expect(formatWeeks(weekRange(8, 12))).toBe("8–12 weeks");
  });

  it("rejects week ranges that run backward or count part weeks", () => {
    expect(() => weekRange(12, 8)).toThrow(DomainError);
    expect(() => weekRange(0, 4)).toThrow(DomainError);
    expect(() => weekRange(8.5, 12)).toThrow(DomainError);
  });

  it("lists the service lines and the audience with a serial comma", () => {
    expect(serviceLineSeries(offering)).toBe("Web applications, mobile-ready platforms, business systems, and AI-enabled solutions");
    expect(audienceSeries(offering)).toBe(
      "Philippine SMEs, startup founders, operations leaders, business owners, companies modernizing manual processes, and selected international clients",
    );
  });

  it("has exactly the four service lines", () => {
    expect(() => defineOffering({ ...offering, serviceLines: offering.serviceLines.slice(0, 3) })).toThrow(DomainError);
  });
});
