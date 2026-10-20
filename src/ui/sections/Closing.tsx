import type { HomepageView } from "@/application/homepage/view";

/** The Midnight band that bookends the hero: one place to start, the email. */
export function Closing({ view, contact }: { view: HomepageView["closing"]; contact: HomepageView["contact"] }) {
  return (
    <section className="closing" id="contact" aria-labelledby="closing-title">
      <div className="closing-card on-dark" data-theme="dark" data-nav-dark>
        <div className="wrap center" data-stagger>
          <p className="small-line">{contact.lead}</p>
          <h2 className="display" id="closing-title">{view.heading}</h2>
          <a className="giant-email" href={contact.email.href}>{contact.email.address}</a>
          <p className="display-sm">{contact.heading}</p>
          <div className="actions center">
            <a className="btn btn-primary btn-lg" href={contact.primaryCta.href}>
              <svg aria-hidden="true"><use href="#i-mail" /></svg>{contact.primaryCta.label}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
