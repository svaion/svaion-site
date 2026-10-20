import type { HomepageView } from "@/application/homepage/view";

export function Ledger({ view }: { view: HomepageView["ledger"] }) {
  const [activityColumn, accountableColumn] = view.columns;
  return (
    <section className="sec" aria-labelledby="ledger-title">
      <div className="wrap">
        <h2 className="display" id="ledger-title" data-reveal>{view.heading}</h2>
        <p className="sub" data-reveal style={{ "--d": 80 }}>{view.intro}</p>
        <div className="card ledger-card" data-reveal style={{ "--d": 120 }}>
          <div className="ledger-head" aria-hidden="true">
            <span>{activityColumn}</span>
            <span>{accountableColumn}</span>
          </div>
          <dl className="ledger" data-stagger>
            {view.rules.map((rule) => (
              <div className="ledger-row" key={rule.aiActivity}>
                <dt>
                  <span className="node" aria-hidden="true"></span>
                  {rule.aiActivity}
                </dt>
                <dd>{rule.accountablePerson}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
