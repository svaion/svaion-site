import type { HomepageView } from "@/application/homepage/view";

export function Audience({ view }: { view: HomepageView["audience"] }) {
  // The segments render twice; the hidden copy lets the marquee loop seamlessly.
  const tiles = [false, true].flatMap((dup) => view.segments.map((segment, i) => ({ segment, i, dup })));
  return (
    <section className="sec for center" id="for" aria-labelledby="for-title">
      <div className="wrap" data-stagger>
        <h2 className="display" id="for-title">{view.heading}</h2>
        <p className="sub">{view.summary}</p>
      </div>
      <div className="loop" data-reveal style={{ "--d": 120 }} aria-label={view.listLabel}>
        <ul className="loop-track" role="list">
          {tiles.map(({ segment, i, dup }) => (
            <li
              key={`${dup ? "dup-" : ""}${i}`}
              className={["tile", i % 2 ? "light" : "", dup ? "dup" : ""].filter(Boolean).join(" ")}
              aria-hidden={dup || undefined}
            >
              <div className="tile-art"><span className="tile-dot" aria-hidden="true"></span><span className="tile-name">{segment.name}</span></div>
              <p className="tile-cap">{segment.benefit}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
