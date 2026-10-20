import type { ReactNode } from "react";
import type { SiteChromeView } from "@/application/site/view";
import { RevealObserver } from "@/ui/behavior/RevealObserver";
import { IconSprite } from "@/ui/brand/IconSprite";
import { Footer } from "@/ui/sections/Footer";
import { Nav } from "@/ui/sections/Nav";

/** The frame every page shares: skip link, nav, the page's own content, and footer. */
export function SiteFrame({ chrome, children }: { chrome: SiteChromeView; children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">{chrome.skipLink}</a>
      <IconSprite />
      <Nav view={chrome.nav} />
      <main id="main">{children}</main>
      <Footer view={chrome.footer} />
      <RevealObserver />
    </>
  );
}
