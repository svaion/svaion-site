import type { HomepageView } from "@/application/homepage/view";
import { HeroDrawing } from "@/ui/brand/HeroDrawing";

const visuallyHidden = { position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" } as const;

export function Hero({ view }: { view: HomepageView["hero"] }) {
  // The track repeats its first item so the rolling kicker loops without a jump.
  const track = [...view.kicker, view.kicker[0]];
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-card on-dark" data-theme="dark" data-nav-dark>
        <div className="hero-in">
          <div className="hero-copy">
            <p className="kicker">
              <span className="kicker-track" aria-hidden="true">
                {track.map((item, i) => <span key={i}>{item}</span>)}
              </span>
              <span style={visuallyHidden}>{view.kickerSentence}</span>
            </p>
            <h1 id="hero-title">{view.headline}</h1>
            <p className="lede">{view.subheadline}</p>
            <div className="actions">
              <a className="btn btn-primary btn-lg" href={view.primaryCta.href}>
                {view.primaryCta.label} <svg className="arrow" aria-hidden="true"><use href="#i-arrow" /></svg>
              </a>
              <a className="btn btn-outline btn-lg" href={view.secondaryCta.href}>{view.secondaryCta.label}</a>
            </div>
            <p className="hero-note">{view.note}</p>
          </div>
          <figure className="drawing">
            <HeroDrawing title={view.drawingTitle} />
            <figcaption>{view.drawingCaption}</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
