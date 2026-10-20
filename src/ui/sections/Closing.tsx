import type { HomepageView } from "@/application/homepage/view";

export function Closing({ view }: { view: HomepageView["closing"] }) {
  return (
    <section className="sec closing center" aria-labelledby="closing-title">
      <div className="wrap" data-stagger>
        <h2 className="display" id="closing-title">{view.heading}</h2>
        <div>
          <a className="btn btn-primary btn-lg" href={view.cta.href}>
            {view.cta.label} <svg className="arrow" aria-hidden="true"><use href="#i-arrow" /></svg>
          </a>
        </div>
      </div>
      <div className="ramp" aria-hidden="true"></div>
    </section>
  );
}
