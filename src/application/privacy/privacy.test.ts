import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { COLLECTION_KINDS, type CollectionKind } from "@/contexts/privacy/model";
import { privacyNotice } from "@/contexts/privacy/notice";
import { getPrivacyNotice } from "./privacy";
import type { Inline, PrivacyNoticeView } from "./view";

const view = getPrivacyNotice();
const src = new URL("../../", import.meta.url).pathname;

/** Code that would make the website collect something the privacy notice must declare. */
const COLLECTS: Record<CollectionKind, RegExp> = {
  cookies: /document\.cookie|localStorage|sessionStorage|indexedDB|from ["']next\/headers["']/,
  analytics: /gtag\(|googletagmanager|google-analytics|plausible|@vercel\/analytics|posthog|mixpanel|cloudflareinsights/i,
  forms: /<form\b/,
  thirdParty: /next\/script|\bsrc=\{?["'`]https?:\/\/|url\(\s*["']?https?:\/\/|@import\s+(url\()?["']?https?:\/\//,
};

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(tsx?|css)$/.test(entry.name) && !entry.name.includes(".test.") ? [path] : [];
  });
}

function text(content: readonly Inline[]): string {
  return content.map((part) => (typeof part === "string" ? part : part.label)).join("");
}

function allText(notice: PrivacyNoticeView): string {
  return notice.sections
    .flatMap((section) => [section.heading, ...section.blocks.flatMap((block) => (block.kind === "paragraph" ? [text(block.content)] : block.items.map((item) => `${item.term ?? ""} ${text(item.content)}`)))])
    .join("\n");
}

describe("Privacy notice page", () => {
  it("declares everything the website's code collects", () => {
    const files = [...sourceFiles(join(src, "app")), ...sourceFiles(join(src, "ui"))];
    expect(files.length).toBeGreaterThan(10);
    for (const kind of COLLECTION_KINDS) {
      const found = files.filter((file) => COLLECTS[kind].test(readFileSync(file, "utf8")));
      if (privacyNotice.website[kind].length === 0) expect(found, `${kind} found but not declared in the privacy notice`).toEqual([]);
    }
  });

  it("says the website collects nothing, and why requests still reach the host", () => {
    const visit = allText(view);
    expect(visit).toContain("This website has no cookies, no analytics, no forms, and no third-party scripts or fonts.");
    expect(visit).toContain("request logs: your IP address, your browser, the page you asked for, and the time of the request.");
  });

  it("lists every right and links the regulator", () => {
    const rights = view.sections.find((section) => section.id === "rights")!;
    const list = rights.blocks.find((block) => block.kind === "list");
    expect(list?.kind === "list" && list.items.length).toBe(8);
    expect(JSON.stringify(rights)).toContain('"href":"https://privacy.gov.ph"');
  });

  it("sends questions to the privacy channel", () => {
    expect(view.contact.email).toEqual({ address: "privacy@svaiontech.com", href: "mailto:privacy@svaiontech.com?subject=Privacy%20request" });
    expect(view.contact.body).toBe("Write to our Data Protection Officer.");
  });

  it("speaks the site's language", () => {
    const words = allText(view);
    expect(words).not.toMatch(/\b(customers?|users?)\b/i);
    expect(view.head.updated).toBe("October 20, 2026");
  });
});
