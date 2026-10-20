import { mailto } from "@/contexts/company/model";
import { svaion } from "@/contexts/company/svaion";
import { accountability, deliveryPath } from "@/contexts/delivery/practice";
import { audienceSeries, formatWeeks, serviceLineSeries, timingMessage } from "@/contexts/offering/model";
import { offering } from "@/contexts/offering/catalog";
import { ILLUSTRATIVE_NOTICE } from "@/contexts/showcase/model";
import { scenarios } from "@/contexts/showcase/scenarios";
import { siteCopy } from "../site/copy";
import { emailLink, getSiteChrome, routes } from "../site/site";
import { copy } from "./copy";
import type { HomepageView } from "./view";

/** Composes the four contexts into the homepage's read model. */
export function getHomepage(year = new Date().getFullYear()): HomepageView {
  const { channels } = svaion;
  const services = serviceLineSeries(offering);
  const audience = audienceSeries(offering);
  const timing = timingMessage(offering.mvpWindow);

  return {
    ...getSiteChrome("homepage", year),
    meta: {
      title: `${svaion.presentationName} — ${svaion.headline}`,
      description: `${svaion.positioning} ${svaion.headline}`,
      path: routes.home,
      shareDescription: svaion.subheadline,
    },
    hero: {
      kicker: offering.serviceLines.map((line) => line.name),
      kickerSentence: `${services}.`,
      headline: svaion.headline,
      subheadline: svaion.subheadline,
      primaryCta: siteCopy.startProject,
      secondaryCta: copy.seeHowWeWork,
      note: `${timing} ${copy.hero.reviewPromise}`,
      drawingTitle: copy.hero.drawingTitle,
      drawingCaption: copy.hero.drawingCaption,
    },
    demo: {
      tagline: svaion.tagline,
      intro: copy.demo.intro,
      tablistLabel: copy.demo.tablistLabel,
      scenarios: scenarios.map((s) => ({
        id: s.id,
        label: s.label,
        request: s.request,
        draft: s.draft.message,
        disclosure: s.draft.disclosure,
        signOff: s.signOff,
      })),
      notice: ILLUSTRATIVE_NOTICE,
    },
    contact: {
      lead: copy.contact.lead,
      email: emailLink(channels.general),
      heading: copy.contact.heading,
      primaryCta: { label: copy.contact.emailCta, href: mailto(channels.general, copy.contact.emailSubject) },
      secondaryCta: copy.seeHowWeWork,
    },
    audience: {
      heading: copy.audience.heading,
      summary: `${audience}.`,
      listLabel: copy.audience.listLabel,
      segments: offering.audience.map(({ name, benefit }) => ({ name, benefit })),
    },
    engagement: {
      heading: copy.engagement.heading,
      paragraphs: copy.engagement.paragraphs,
      planLabel: `What a ${svaion.shortName} engagement includes`,
      planWindow: `${formatWeeks(offering.mvpWindow.weeks)}.`,
      planNote: copy.engagement.planNote,
      commitments: offering.commitments,
      cta: siteCopy.startProject,
    },
    process: {
      heading: copy.process.heading,
      intro: copy.process.intro,
      stages: deliveryPath.map(({ name, description }) => ({ name, description })),
    },
    services: {
      heading: copy.services.heading,
      intro: copy.services.intro,
      lines: offering.serviceLines.map(({ id, name, summary }) => ({ id, name, summary })),
    },
    ledger: {
      heading: copy.ledger.heading,
      intro: copy.ledger.intro,
      columns: copy.ledger.columns,
      rules: accountability.map(({ aiActivity, accountablePerson }) => ({ aiActivity, accountablePerson })),
    },
    faq: {
      heading: copy.faq.heading,
      contactLabel: copy.faq.contactLabel,
      email: emailLink(channels.general),
      proposalsNote: `For proposals, write to ${channels.sales.address}.`,
      questions: [
        copy.faq.meaning,
        { question: copy.faq.durationQuestion, answer: `${timing} ${copy.faq.stagedPlan}` },
        copy.faq.team,
        { question: copy.faq.buildQuestion, answer: `${services}, ${copy.faq.buildProcess}` },
        copy.faq.aiUse,
        { question: copy.faq.audienceQuestion, answer: `${audience}.` },
        copy.faq.tools,
        { question: copy.faq.startQuestion, answer: `Email ${channels.general.address} ${copy.faq.startAfterEmail}` },
      ],
    },
    closing: {
      heading: `Start with ${svaion.shortName}.`,
      cta: siteCopy.startProject,
    },
  };
}
