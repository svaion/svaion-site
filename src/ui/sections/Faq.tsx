import type { HomepageView } from "@/application/homepage/view";

export function Faq({ view }: { view: HomepageView["faq"] }) {
  return (
    <section className="sec" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq-grid">
        <div className="faq-side" data-reveal>
          <h2 className="display" id="faq-title">{view.heading}</h2>
          <p className="faq-label">{view.contactLabel}</p>
          <a className="pill-link" href={view.email.href}>
            <svg aria-hidden="true"><use href="#i-mail" /></svg>
            <span>{view.email.address}</span>
          </a>
          <p className="faq-note">{view.proposalsNote}</p>
        </div>
        <div className="faq-list" data-stagger>
          {view.questions.map((entry) => (
            <details key={entry.question}>
              <summary>{entry.question}</summary>
              <p>{entry.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
