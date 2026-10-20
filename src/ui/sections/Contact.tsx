import type { HomepageView } from "@/application/homepage/view";

export function Contact({ view }: { view: HomepageView["contact"] }) {
  return (
    <section className="sec contact-strip center" id="contact" aria-labelledby="contact-title">
      <div className="wrap" data-stagger>
        <p className="small-line">{view.lead}</p>
        <a className="giant-email" href={view.email.href}>{view.email.address}</a>
        <p className="display-sm" id="contact-title">{view.heading}</p>
        <div className="actions center">
          <a className="btn btn-primary" href={view.primaryCta.href}><svg aria-hidden="true"><use href="#i-mail" /></svg>{view.primaryCta.label}</a>
          <a className="btn btn-outline" href={view.secondaryCta.href}>{view.secondaryCta.label}</a>
        </div>
      </div>
    </section>
  );
}
