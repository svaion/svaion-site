/** The page's shared SVG defs: the ligature gradient and the line icons, referenced with <use href="#…">. */
export function IconSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="g-lig" gradientUnits="userSpaceOnUse" x1="58" y1="0" x2="1668" y2="0">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
        <symbol id="i-check" viewBox="0 0 16 16">
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-arrow" viewBox="0 0 18 18">
          <path d="M3 9h11M9.5 4.5 14 9l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-mail" viewBox="0 0 16 16">
          <rect x="1.5" y="3.5" width="13" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="m2.5 5 5.5 4 5.5-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </symbol>
        <symbol id="i-web" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
          <path d="M3 9h18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </symbol>
        <symbol id="i-mobile" viewBox="0 0 24 24">
          <rect x="7" y="2.5" width="10" height="19" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
          <path d="M11 18h2" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </symbol>
        <symbol id="i-systems" viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.75">
            <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
            <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
            <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
            <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
          </g>
        </symbol>
        <symbol id="i-ai" viewBox="0 0 24 24">
          <path d="M19 12a7 7 0 1 1-2.05-4.95" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <circle cx="18.5" cy="5.5" r="2.5" fill="#22D3EE" />
        </symbol>
      </defs>
    </svg>
  );
}
