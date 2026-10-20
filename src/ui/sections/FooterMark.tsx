"use client";

import { useEffect, useRef } from "react";
import { Wordmark } from "@/ui/brand/Wordmark";

/** The large footer wordmark. Its logo reveal waits (sv-wait) until half of it is on screen. */
export function FooterMark() {
  const mark = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = mark.current;
    if (!svg || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    svg.classList.add("sv-wait");
    const io = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio < 0.5) return;
      svg.classList.replace("sv-wait", "sv-run");
      io.disconnect();
    }, { threshold: 0.5 });
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <div className="footer-mark" aria-hidden="true">
      <Wordmark ref={mark} className="sv-reveal" focusable="false" />
    </div>
  );
}
