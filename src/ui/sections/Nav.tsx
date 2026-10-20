"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { HomepageView } from "@/application/homepage/view";
import { Wordmark } from "@/ui/brand/Wordmark";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const isScrolled = () => window.scrollY > 24;
const notScrolled = () => false;

export function Nav({ view }: { view: HomepageView["nav"] }) {
  const nav = useRef<HTMLElement>(null);
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, notScrolled);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPaddingTop, setMenuPaddingTop] = useState<number>();

  const closeMenu = () => setMenuOpen(false);

  function toggleMenu() {
    // The open menu starts just below the nav bar, whatever its height on this device.
    if (!menuOpen && nav.current) setMenuPaddingTop(nav.current.getBoundingClientRect().bottom + 16);
    setMenuOpen(!menuOpen);
  }

  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    const wide = window.matchMedia("(min-width: 900px)");
    const onWide = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, []);

  const navClass = ["nav", scrolled && "scrolled", menuOpen && "menu-open"].filter(Boolean).join(" ");

  return (
    <>
      <header ref={nav} className={navClass} id="nav" data-theme="dark">
        <div className="nav-in">
          <a className="brand" href="#top" aria-label={view.homeLabel}>
            <Wordmark className="wordmark sv-reveal sv-run" aria-hidden="true" focusable="false" />
          </a>
          <nav aria-label={view.navLabel}>
            <ul className="nav-links" role="list">
              {view.links.map((link) => (
                <li key={link.href}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="nav-end">
            <a className="btn btn-primary btn-sm" href={view.cta.href}>{view.cta.label}</a>
            <button
              className="menu-btn"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="menu"
              aria-label={menuOpen ? view.menuCloseLabel : view.menuOpenLabel}
              onClick={toggleMenu}
            >
              <span className="menu-icon" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </header>

      <div
        className="menu"
        id="menu"
        data-theme="dark"
        hidden={!menuOpen}
        style={menuPaddingTop === undefined ? undefined : { paddingTop: `${menuPaddingTop}px` }}
      >
        {view.links.map((link) => (
          <a key={link.href} className="menu-link" href={link.href} onClick={closeMenu}>{link.label}</a>
        ))}
        <div className="menu-cta">
          <a className="btn btn-primary btn-lg" href={view.cta.href} onClick={closeMenu}>{view.cta.label}</a>
          <a className="menu-email" href={view.email.href} onClick={closeMenu}>{view.email.address}</a>
        </div>
      </div>
    </>
  );
}
