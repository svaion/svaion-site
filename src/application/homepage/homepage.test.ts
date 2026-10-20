import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getHomepage } from "./homepage";

const view = getHomepage(2026);
const reference = readFileSync(new URL("../../../reference/homepage-v9.html", import.meta.url), "utf8");

/** Every worded string in the view; ids are keys, not words. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, field]) => (key === "id" ? [] : strings(field)));
  }
  return [];
}

describe("Homepage", () => {
  it("uses the approved messages verbatim", () => {
    expect(view.hero.headline).toBe("Intelligent software, engineered for growth.");
    expect(view.hero.subheadline).toBe("Svaion designs, builds, and supports dependable digital products using AI-assisted, human-led engineering.");
    expect(view.hero.note.startsWith("Launch a focused MVP in approximately 8–12 weeks, depending on scope.")).toBe(true);
  });

  it("shows the tagline once", () => {
    expect(strings(view).filter((text) => text.includes("Intelligence, switched on.")).length).toBe(1);
  });

  it("says nothing the approved reference page does not", () => {
    const missing = strings(view).filter((text) => !reference.includes(text));
    expect(missing).toEqual([]);
  });
});
