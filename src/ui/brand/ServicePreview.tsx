import type { JSX } from "react";
import type { ServiceLineId } from "@/application/homepage/view";

// Wordless sketches of each service line's screens: shapes only, so they add no claims and no copy.
// Colors come from the stylesheet (.pv-*), so the sketches follow the design-system tokens.

function WebApplication() {
  return (
    <svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMax meet" focusable="false">
      <rect className="pv-win" x="48" y="28" width="544" height="260" rx="14" />
      <circle className="pv-bar-strong" cx="70" cy="47" r="4" />
      <circle className="pv-bar-strong" cx="86" cy="47" r="4" />
      <circle className="pv-bar-strong" cx="102" cy="47" r="4" />
      <rect className="pv-bar" x="232" y="41" width="176" height="12" rx="6" />
      <rect className="pv-rule" x="48" y="66" width="544" height="1" />
      <rect className="pv-rule" x="176" y="66" width="1" height="200" />
      <rect className="pv-act-soft" x="58" y="80" width="108" height="22" rx="6" />
      <rect className="pv-act" x="68" y="87" width="64" height="8" rx="4" />
      <rect className="pv-bar" x="68" y="115" width="80" height="8" rx="4" />
      <rect className="pv-bar" x="68" y="139" width="56" height="8" rx="4" />
      <rect className="pv-bar" x="68" y="163" width="72" height="8" rx="4" />
      <rect className="pv-bar" x="68" y="187" width="48" height="8" rx="4" />
      <rect className="pv-ink" x="196" y="84" width="128" height="12" rx="6" />
      <rect className="pv-act" x="512" y="80" width="64" height="22" rx="11" />
      <rect className="pv-card" x="196" y="114" width="118" height="46" rx="10" />
      <rect className="pv-card" x="326" y="114" width="118" height="46" rx="10" />
      <rect className="pv-card" x="456" y="114" width="120" height="46" rx="10" />
      <rect className="pv-bar" x="208" y="125" width="44" height="6" rx="3" />
      <rect className="pv-bar-strong" x="208" y="138" width="72" height="11" rx="4" />
      <rect className="pv-bar" x="338" y="125" width="44" height="6" rx="3" />
      <rect className="pv-bar-strong" x="338" y="138" width="56" height="11" rx="4" />
      <rect className="pv-bar" x="468" y="125" width="44" height="6" rx="3" />
      <rect className="pv-bar-strong" x="468" y="138" width="80" height="11" rx="4" />
      <rect className="pv-bar" x="196" y="180" width="96" height="8" rx="4" />
      <rect className="pv-bar" x="316" y="180" width="64" height="8" rx="4" />
      <rect className="pv-bar" x="404" y="180" width="52" height="8" rx="4" />
      <rect className="pv-bar" x="516" y="177" width="56" height="14" rx="7" />
      <rect className="pv-act-soft" x="186" y="198" width="396" height="28" rx="8" />
      <rect className="pv-bar-strong" x="196" y="208" width="112" height="8" rx="4" />
      <rect className="pv-bar-strong" x="316" y="208" width="56" height="8" rx="4" />
      <rect className="pv-bar-strong" x="404" y="208" width="60" height="8" rx="4" />
      <rect className="pv-act" x="516" y="205" width="56" height="14" rx="7" />
    </svg>
  );
}

// Tall card: the whole phone shows; short cards: its top peeks out of the frame.
function MobilePlatform() {
  return (
    <svg viewBox="0 0 300 520" preserveAspectRatio="xMidYMin slice" focusable="false">
      <rect className="pv-phone" x="70" y="32" width="160" height="520" rx="30" />
      <rect className="pv-ink" x="122" y="46" width="56" height="14" rx="7" />
      <rect className="pv-ink" x="88" y="78" width="72" height="10" rx="5" />
      <rect className="pv-bar" x="88" y="98" width="124" height="20" rx="10" />
      <circle className="pv-bar-strong" cx="100" cy="132" r="10" />
      <rect className="pv-bar-strong" x="118" y="125" width="80" height="7" rx="3.5" />
      <rect className="pv-bar" x="118" y="137" width="52" height="6" rx="3" />
      <circle className="pv-bar-strong" cx="100" cy="168" r="10" />
      <rect className="pv-bar-strong" x="118" y="161" width="70" height="7" rx="3.5" />
      <rect className="pv-bar" x="118" y="173" width="60" height="6" rx="3" />
      <rect className="pv-act-soft" x="82" y="188" width="136" height="32" rx="10" />
      <circle className="pv-act" cx="100" cy="204" r="10" />
      <rect className="pv-bar-strong" x="118" y="197" width="84" height="7" rx="3.5" />
      <rect className="pv-bar" x="118" y="209" width="48" height="6" rx="3" />
      <circle className="pv-bar-strong" cx="100" cy="240" r="10" />
      <rect className="pv-bar-strong" x="118" y="233" width="64" height="7" rx="3.5" />
      <rect className="pv-bar" x="118" y="245" width="56" height="6" rx="3" />
      <circle className="pv-bar-strong" cx="100" cy="276" r="10" />
      <rect className="pv-bar-strong" x="118" y="269" width="76" height="7" rx="3.5" />
      <rect className="pv-bar" x="118" y="281" width="44" height="6" rx="3" />
      <circle className="pv-bar-strong" cx="100" cy="312" r="10" />
      <rect className="pv-bar-strong" x="118" y="305" width="58" height="7" rx="3.5" />
      <rect className="pv-bar" x="118" y="317" width="62" height="6" rx="3" />
      <rect className="pv-act" x="88" y="452" width="124" height="28" rx="14" />
    </svg>
  );
}

function BusinessSystem() {
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" focusable="false">
      <path className="pv-path" d="M94 90C108 90 108 86 122 86" />
      <path className="pv-path" d="M178 86C192 86 192 90 206 90" />
      <rect className="pv-win" x="16" y="46" width="78" height="88" rx="10" />
      <rect className="pv-bar-strong" x="26" y="58" width="44" height="7" rx="3.5" />
      <rect className="pv-bar" x="26" y="74" width="58" height="11" rx="4" />
      <rect className="pv-bar" x="26" y="92" width="58" height="11" rx="4" />
      <rect className="pv-act" x="26" y="112" width="34" height="12" rx="6" />
      <rect className="pv-ink" x="122" y="58" width="56" height="56" rx="14" />
      <rect className="pv-act" x="134" y="70" width="14" height="14" rx="3" />
      <rect className="pv-ink-soft" x="152" y="70" width="14" height="14" rx="3" />
      <rect className="pv-ink-soft" x="134" y="88" width="14" height="14" rx="3" />
      <rect className="pv-ink-soft" x="152" y="88" width="14" height="14" rx="3" />
      <rect className="pv-win" x="206" y="40" width="78" height="100" rx="10" />
      <rect className="pv-bar-strong" x="216" y="52" width="40" height="7" rx="3.5" />
      <rect className="pv-rule" x="216" y="68" width="58" height="1" />
      <rect className="pv-bar" x="216" y="76" width="58" height="7" rx="3.5" />
      <rect className="pv-rule" x="216" y="92" width="58" height="1" />
      <rect className="pv-bar" x="216" y="100" width="46" height="7" rx="3.5" />
      <rect className="pv-rule" x="216" y="116" width="58" height="1" />
      <rect className="pv-bar" x="216" y="124" width="52" height="7" rx="3.5" />
    </svg>
  );
}

function AiSolution() {
  return (
    <svg viewBox="0 0 300 180" preserveAspectRatio="xMidYMid meet" focusable="false">
      <rect className="pv-win" x="128" y="16" width="152" height="42" rx="14" />
      <rect className="pv-bar-strong" x="142" y="29" width="112" height="7" rx="3.5" />
      <rect className="pv-bar" x="142" y="42" width="72" height="7" rx="3.5" />
      <circle className="pv-dot" cx="22" cy="78" r="6" />
      <rect className="pv-win" x="36" y="70" width="176" height="66" rx="14" />
      <rect className="pv-bar-strong" x="50" y="84" width="140" height="7" rx="3.5" />
      <rect className="pv-bar-strong" x="50" y="97" width="118" height="7" rx="3.5" />
      <rect className="pv-act-soft" x="50" y="112" width="66" height="14" rx="7" />
      <rect className="pv-act" x="58" y="116" width="6" height="6" rx="1.5" />
      <rect className="pv-act" x="70" y="117" width="38" height="4" rx="2" />
      <circle className="pv-ok" cx="48" cy="156" r="8" />
      <path className="pv-tick" d="M44.5 156l2.5 2.5 4.5-5" />
      <rect className="pv-ok-soft" x="64" y="152" width="92" height="8" rx="4" />
    </svg>
  );
}

const PREVIEWS: Readonly<Record<ServiceLineId, () => JSX.Element>> = {
  "web-applications": WebApplication,
  "mobile-ready-platforms": MobilePlatform,
  "business-systems": BusinessSystem,
  "ai-enabled-solutions": AiSolution,
};

/** A small, decorative screen for one service line. */
export function ServicePreview({ id }: { id: ServiceLineId }) {
  const Preview = PREVIEWS[id];
  return (
    <div className="preview" aria-hidden="true">
      <Preview />
    </div>
  );
}
