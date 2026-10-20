import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** Files other places load by absolute URL; moving one breaks them silently. */
describe("Stable URLs", () => {
  it("serves the email signature's logo at /brand/svaion-ai-88.png", () => {
    const png = readFileSync(new URL("../../public/brand/svaion-ai-88.png", import.meta.url));
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([94, 88]);
  });
});
