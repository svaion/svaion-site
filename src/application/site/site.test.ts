import { describe, expect, it } from "vitest";
import { getSiteChrome, getSitemap, routes } from "./site";

describe("Site chrome", () => {
  it("links the homepage to its own sections and every other page back into it", () => {
    const home = getSiteChrome("homepage", 2026);
    const subpage = getSiteChrome("subpage", 2026);
    expect(home.nav.links.every((link) => link.href.startsWith("#"))).toBe(true);
    expect(subpage.nav.links.every((link) => link.href.startsWith("/#"))).toBe(true);
    expect(subpage.footer.links).toEqual(subpage.nav.links);
    expect(subpage.nav.cta.href).toBe("/#contact");
    expect(subpage.nav.homeHref).toBe(routes.home);
  });

  it("links to the privacy notice from every page", () => {
    expect(getSiteChrome("homepage").footer.privacy.href).toBe(routes.privacy);
    expect(getSiteChrome("subpage").footer.privacy.href).toBe(routes.privacy);
  });

  it("lists every page in the sitemap at its canonical address", () => {
    expect(getSitemap()).toEqual(["https://svaiontech.com/", "https://svaiontech.com/privacy/"]);
  });
});
