import type { FooterView } from "@/application/site/view";
import { FooterMark } from "./FooterMark";

export function Footer({ view }: { view: FooterView }) {
  return (
    <footer className="footer" data-theme="dark">
      <div className="wrap footer-grid">
        <div className="footer-col">
          <strong>{view.name}</strong>
          <span>{view.descriptor}</span>
          <a href={view.site.href}>{view.site.label}</a>
        </div>
        <div className="footer-col">
          <strong>{view.emailHeading}</strong>
          {view.emails.map((email) => (
            <a key={email.address} href={email.href}>{email.address}</a>
          ))}
        </div>
        <div className="footer-col">
          <strong>{view.linksHeading}</strong>
          <ul className="footer-links" role="list">
            {view.links.map((link) => (
              <li key={link.href}><a href={link.href}>{link.label}</a></li>
            ))}
          </ul>
          <span>{view.social}</span>
        </div>
      </div>
      <FooterMark />
      <div className="wrap">
        <div className="footer-legal">
          {view.legalNotice && <span>{view.legalNotice}</span>}
          <span className="footer-legal-end">
            <a href={view.privacy.href}>{view.privacy.label}</a>
            <span>{view.copyright}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
