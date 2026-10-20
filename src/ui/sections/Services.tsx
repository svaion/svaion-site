import type { HomepageView, ServiceLineId } from "@/application/homepage/view";

/** The sprite symbol drawn for each service line. */
const ICONS: Readonly<Record<ServiceLineId, string>> = {
  "web-applications": "#i-web",
  "mobile-ready-platforms": "#i-mobile",
  "business-systems": "#i-systems",
  "ai-enabled-solutions": "#i-ai",
};

export function Services({ view }: { view: HomepageView["services"] }) {
  return (
    <section className="sec" id="services" aria-labelledby="services-title">
      <div className="wrap">
        <h2 className="display" id="services-title" data-reveal>{view.heading}</h2>
        <p className="sub" data-reveal style={{ "--d": 80 }}>{view.intro}</p>
        <div className="services-grid" data-stagger>
          {view.lines.map((line) => (
            <article className="card" key={line.id}>
              <svg className="icon" aria-hidden="true"><use href={ICONS[line.id]} /></svg>
              <h3>{line.name}</h3>
              <p>{line.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
