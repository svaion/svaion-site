import type { HomepageView } from "@/application/homepage/view";

export function Engagement({ view }: { view: HomepageView["engagement"] }) {
  return (
    <section className="sec" id="promise" aria-labelledby="promise-title">
      <div className="wrap">
        <div className="combo-grid">
          <article className="paper">
            <h2 id="promise-title">{view.heading}</h2>
            {view.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>
          <article className="plan on-dark" data-theme="dark" aria-label={view.planLabel}>
            <p className="plan-head">
              <span className="plan-big">{view.planWindow}</span>
              <span className="plan-sub">{view.planNote}</span>
            </p>
            <ul className="checks" role="list">
              {view.commitments.map((commitment) => (
                <li key={commitment}>
                  <svg aria-hidden="true"><use href="#i-check" /></svg>
                  {commitment}
                </li>
              ))}
            </ul>
            <a className="btn btn-primary" href={view.cta.href}>{view.cta.label}</a>
          </article>
        </div>
      </div>
    </section>
  );
}
