const LIGATURE =
  "M514.9 -22.2Q377.3 -22.2 274.4 46.8Q171.4 115.8 114.7 239.8Q58.0 363.8 58.0 529.1Q58.0 691.5 115.5 815.3Q173.0 939.1 275.7 1008.6Q378.4 1078.2 512.7 1078.2Q581.7 1078.2 640.6 1059.7Q699.5 1041.3 746.4 1004.7Q793.3 968.2 825.7 913.0H829.3V1056.0H1117.2V397.5A130.0 130.0 0 0 1 1377.2 397.5V1056.0H1668.2V397.5A419.5 419.5 0 0 0 878.7 200.0Q825.0 300.6 829.3 157.8H826.2Q795.8 98.5 749.2 58.5Q702.6 18.5 643.5 -1.8Q584.4 -22.2 514.9 -22.2ZM591.1 217.8Q665.9 217.8 721.7 256.2Q777.5 294.7 808.4 364.8Q839.3 434.9 839.3 529.1Q839.3 623.7 808.4 693.3Q777.5 762.8 721.7 801.3Q665.9 839.8 591.1 839.8Q520.1 839.8 466.9 803.1Q413.6 766.5 384.4 697.4Q355.2 628.3 355.2 529.1Q355.2 430.3 384.4 360.7Q413.6 291.0 466.9 254.4Q520.1 217.8 591.1 217.8Z";

/** The ai ligature drawn over its construction lines; the guides draw in, the ligature wipes, the dot switches on. */
export function HeroDrawing({ title }: { title: string }) {
  return (
    <svg viewBox="-230 -1676 2140 1806" role="img" aria-labelledby="drawing-title">
      <title id="drawing-title">{title}</title>
      <g transform="scale(1 -1)">
        <g className="guides" fill="none" stroke="rgba(248,250,252,.3)" strokeWidth="5">
          <line x1="-200" y1="0" x2="1900" y2="0" className="gh" style={{ "--g": 0 }} />
          <line x1="-200" y1="1056" x2="1900" y2="1056" strokeDasharray="14 22" className="gh" style={{ "--g": 1 }} />
          <line x1="-200" y1="1526" x2="1900" y2="1526" strokeDasharray="14 22" className="gh" style={{ "--g": 2 }} />
          <line x1="973" y1="-120" x2="973" y2="1200" strokeDasharray="14 22" className="gv" style={{ "--g": 3 }} />
          <line x1="1523" y1="-120" x2="1523" y2="1616" strokeDasharray="14 22" className="gv" style={{ "--g": 4 }} />
          <circle cx="1249" cy="397" r="419" className="gc" style={{ "--g": 5 }} />
          <circle cx="1249" cy="397" r="130" className="gc" style={{ "--g": 6 }} />
          <path d="M1209 397h80M1249 357v80" className="gc" style={{ "--g": 7 }} />
          <circle cx="1523" cy="1346" r="270" className="gc" style={{ "--g": 8 }} />
          <path d="M1483 1346h80M1523 1306v80" className="gc" style={{ "--g": 9 }} />
        </g>
        <path className="lig" fill="url(#g-lig)" d={LIGATURE} />
        <circle className="pulse" cx="1522.7" cy="1345.6" r="180" />
        <circle className="pop dot" cx="1522.7" cy="1345.6" r="180" />
      </g>
    </svg>
  );
}
