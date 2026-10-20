"use client";

import { useEffect } from "react";

/**
 * Scroll reveals: numbers stagger children, then marks each reveal target `in` as it enters the
 * viewport. `js` goes on <html> only after the observer is set up, so the stylesheet hides nothing
 * unless this ran.
 */
export function RevealObserver() {
  useEffect(() => {
    document.querySelectorAll("[data-stagger], .menu, .checks").forEach((list) => {
      Array.from(list.children).forEach((child, i) => (child as HTMLElement).style.setProperty("--i", String(i)));
    });
    const reveals = document.querySelectorAll("[data-reveal], [data-stagger], .combo-grid, .phone");
    let seen: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window) {
      seen = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("in");
            seen?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px" },
      );
      reveals.forEach((element) => seen?.observe(element));
    } else {
      reveals.forEach((element) => element.classList.add("in"));
    }
    document.documentElement.classList.add("js");
    return () => seen?.disconnect();
  }, []);

  return null;
}
