import type { HomepageView } from "@/application/homepage/view";

export function Audience({ view }: { view: HomepageView["audience"] }) {
  return (
    <section className="sec for" id="for" aria-labelledby="for-title">
      <div className="wrap">
        <h2 className="display" id="for-title" data-reveal>{view.heading}</h2>
        <p className="sub" data-reveal style={{ "--d": 80 }}>{view.summary}</p>
        <ul className="segments" role="list" aria-label={view.listLabel} data-stagger>
          {view.segments.map((segment) => (
            <li className="segment" key={segment.name}>
              <h3>{segment.name}</h3>
              <p>{segment.benefit}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
