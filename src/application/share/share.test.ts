import { describe, expect, it } from "vitest";
import { getShareImage } from "./share";

describe("Share image", () => {
  const share = getShareImage();

  it("uses the approved headline and the company's domain", () => {
    expect(share.headline).toBe("Intelligent software, engineered for growth.");
    expect(share.domain).toBe("svaiontech.com");
    expect(share.alt).toBe("Svaion Technologies: Intelligent software, engineered for growth.");
  });

  it("is a 1200×630 PNG with a .png path, so static hosts serve it as an image", () => {
    expect(share.id.endsWith(".png")).toBe(true);
    expect(share.url).toBe(`/opengraph-image/${share.id}`);
    expect([share.width, share.height, share.type]).toEqual([1200, 630, "image/png"]);
  });
});
