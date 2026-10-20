import type { HomepageView } from "@/application/homepage/view";

export function Process({ view }: { view: HomepageView["process"] }) {
  return (
    <section className="sec" id="how" aria-labelledby="how-title">
      <div className="wrap">
        <h2 className="display" id="how-title" data-reveal>{view.heading}</h2>
        <p className="sub" data-reveal style={{ "--d": 80 }}>{view.intro}</p>
        <ol className="steps" data-stagger role="list">
          {view.stages.map((stage) => (
            <li className="step" key={stage.name}>
              <h3>{stage.name}</h3>
              <p>{stage.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
