import type { HomepageView } from "@/application/homepage/view";
import { ServicePreview } from "@/ui/brand/ServicePreview";

export function Services({ view }: { view: HomepageView["services"] }) {
  return (
    <section className="sec" id="services" aria-labelledby="services-title">
      <div className="wrap">
        <h2 className="display" id="services-title" data-reveal>{view.heading}</h2>
        <p className="sub" data-reveal style={{ "--d": 80 }}>{view.intro}</p>
        <div className="services-grid" data-stagger>
          {view.lines.map((line) => (
            <article className={`card service service-${line.id}`} key={line.id}>
              <ServicePreview id={line.id} />
              <h3>{line.name}</h3>
              <p>{line.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
