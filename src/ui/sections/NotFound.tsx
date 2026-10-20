import type { NotFoundView } from "@/application/not-found/notFound";

export function NotFound({ view }: { view: NotFoundView["page"] }) {
  return (
    <section className="hero" aria-labelledby="not-found-title">
      <div className="hero-card on-dark" data-theme="dark">
        <div className="hero-in solo">
          <div className="hero-copy">
            <p className="kicker">{view.code}</p>
            <h1 id="not-found-title">{view.heading}</h1>
            <p className="lede">{view.lede}</p>
            <div className="actions">
              <a className="btn btn-primary btn-lg" href={view.home.href}>
                {view.home.label} <svg className="arrow" aria-hidden="true"><use href="#i-arrow" /></svg>
              </a>
              <a className="btn btn-outline btn-lg" href={view.email.href}>{view.email.label}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
