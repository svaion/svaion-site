"use client";

import { useState } from "react";
import type { HomepageView } from "@/application/homepage/view";

/** The phone plays each scenario out; toggling a panel's hidden attribute replays its CSS sequence. */
export function Demo({ view }: { view: HomepageView["demo"] }) {
  const [active, setActive] = useState(view.scenarios[0]?.id);
  return (
    <section className="sec intro center" id="demo" aria-labelledby="intro-title">
      <div className="wrap" data-stagger>
        <h2 className="display" id="intro-title">{view.tagline}</h2>
        <p className="sub">{view.intro}</p>
      </div>
      <div className="chips" data-reveal style={{ "--d": 140 }} role="tablist" aria-label={view.tablistLabel}>
        {view.scenarios.map((scenario) => {
          const on = scenario.id === active;
          return (
            <button
              key={scenario.id}
              className={on ? "chip is-active" : "chip"}
              type="button"
              role="tab"
              id={`tab-${scenario.id}`}
              aria-selected={on}
              aria-controls={`demo-${scenario.id}`}
              onClick={(event) => {
                setActive(scenario.id);
                event.currentTarget.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
              }}
            >
              {scenario.label}
            </button>
          );
        })}
      </div>
      <div className="phone-wrap">
        <div className="phone" aria-live="polite">
          <div className="phone-top" aria-hidden="true"><span>9:41</span><span className="phone-island"></span><span>5G</span></div>
          {view.scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="thread"
              id={`demo-${scenario.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${scenario.id}`}
              hidden={scenario.id !== active}
            >
              <p className="msg from">{scenario.request}</p>
              <p className="typing" aria-hidden="true"><span></span><span></span><span></span></p>
              <p className="msg ai">{scenario.draft}<small>{scenario.disclosure}</small></p>
              <p className="msg ok"><svg aria-hidden="true"><use href="#i-check" /></svg>{scenario.signOff}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="demo-note">{view.notice}</p>
    </section>
  );
}
