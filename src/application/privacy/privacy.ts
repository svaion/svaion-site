import { mailto, registrationNotice } from "@/contexts/company/model";
import { svaion } from "@/contexts/company/svaion";
import { ACT, COLLECTION_KINDS, REGULATOR, type ProcessingActivity } from "@/contexts/privacy/model";
import { privacyNotice } from "@/contexts/privacy/notice";
import { joinSeries } from "@/contexts/shared/text";
import { copy } from "./copy";
import type { Block, Inline, Link, NoticeSection, PrivacyNoticeView } from "./view";

const paragraph = (...content: Inline[]): Block => ({ kind: "paragraph", content });

/** Splits text around the first occurrence of a phrase and links it. */
function linkify(text: string, link: Link): Inline[] {
  const at = text.indexOf(link.label);
  if (at < 0) return [text];
  return [text.slice(0, at), link, text.slice(at + link.label.length)].filter((part) => part !== "");
}

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

function activityBlocks(activity: ProcessingActivity, dataSentence: string): Block[] {
  const bases = activity.lawfulBases;
  return [
    paragraph(dataSentence),
    paragraph(copy.purposesLead),
    { kind: "list", items: activity.purposes.map((purpose) => ({ content: [purpose] })) },
    ...(bases.length === 1
      ? [paragraph(`${copy.basisLead} ${lowerFirst(bases[0].statement)}`)]
      : [paragraph(copy.basesLead), { kind: "list", items: bases.map((basis) => ({ content: [basis.statement] })) } satisfies Block]),
  ];
}

function activity(id: ProcessingActivity["id"]): ProcessingActivity {
  const found = privacyNotice.activities.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`The privacy notice has no ${id} activity.`);
  return found;
}

/** Composes the Privacy and Company contexts into the privacy notice page. */
export function getPrivacyNotice(): PrivacyNoticeView {
  const notice = privacyNotice;
  const privacyEmail: Link = { label: notice.contact.address, href: mailto(notice.contact) };
  const regulator: Link = { label: REGULATOR.name, href: REGULATOR.site };
  const officer = notice.dataProtectionOfficer.name;
  const visit = activity("visit");
  const email = activity("email");

  const absent = COLLECTION_KINDS.filter((kind) => notice.website[kind].length === 0);
  const present = COLLECTION_KINDS.flatMap((kind) => notice.website[kind]);
  const collection = [
    absent.length > 0 && `This website has ${joinSeries(absent.map((kind) => `no ${copy.collectionKinds[kind]}`))}.`,
    notice.website.thirdParty.length === 0 && `Everything on it is served from ${svaion.domain}.`,
  ]
    .filter(Boolean)
    .join(" ");
  const legalNotice = registrationNotice(svaion);

  const sections: NoticeSection[] = [
    {
      id: "who",
      heading: copy.sections.who,
      blocks: [
        paragraph(
          `${notice.controller} (${svaion.shortName}) decides how the personal data described here is used. Under the ${ACT.name} (${ACT.citation}), that makes us its personal information controller.`,
        ),
        ...(legalNotice ? [paragraph(legalNotice)] : []),
        paragraph(
          officer ? `Our Data Protection Officer, ${officer}, answers questions about this notice at ` : "Our Data Protection Officer answers questions about this notice at ",
          privacyEmail,
          ".",
        ),
      ],
    },
    {
      id: "visit",
      heading: copy.sections.visit,
      blocks: [
        ...(collection ? [paragraph(collection)] : []),
        ...(present.length > 0
          ? [paragraph(copy.declaredLead), { kind: "list", items: present.map((item) => ({ term: item.name, content: [item.purpose] })) } satisfies Block]
          : []),
        ...activityBlocks(visit, `A hosting provider delivers it and keeps standard request logs: ${joinSeries(visit.personalData)}.`),
      ],
    },
    {
      id: "email",
      heading: copy.sections.email,
      blocks: activityBlocks(
        email,
        `When you write to any ${svaion.domain} address, we receive ${joinSeries(email.personalData)}, plus anything else you choose to tell us.`,
      ),
    },
    {
      id: "ai",
      heading: copy.sections.ai,
      blocks: [
        paragraph(`We may use AI tools to ${joinSeries(notice.ai.tasks)}. ${notice.ai.review}`),
        paragraph(notice.ai.training),
        paragraph(copy.aiDecidesAlone),
      ],
    },
    {
      id: "sharing",
      heading: copy.sections.sharing,
      blocks: [
        paragraph(copy.sharing.neverSell),
        paragraph(copy.sharing.processorsLead),
        { kind: "list", items: notice.processors.map((processor) => ({ term: processor.service, content: [processor.role] })) },
        paragraph(copy.sharing.disclosure),
        ...(notice.transfersAbroad ? [paragraph(copy.sharing.abroad)] : []),
      ],
    },
    {
      id: "retention",
      heading: copy.sections.retention,
      blocks: [
        {
          kind: "list",
          items: notice.activities.flatMap((a) => a.retention).map((rule) => ({ term: rule.applies, content: [rule.period] })),
        },
      ],
    },
    {
      id: "rights",
      heading: copy.sections.rights,
      blocks: [
        paragraph(`The ${ACT.name} gives you these rights:`),
        { kind: "list", items: notice.rights.map((right) => ({ term: right.name, content: linkify(right.description, regulator) })) },
        paragraph(`${copy.rightsHowTo} `, privacyEmail, "."),
      ],
    },
    { id: "changes", heading: copy.sections.changes, blocks: [paragraph(copy.changes)] },
  ];

  return {
    meta: {
      title: `${copy.title} — ${svaion.presentationName}`,
      description: `How ${svaion.presentationName} handles personal data from its website and email, and your rights under the ${ACT.name}.`,
    },
    head: {
      title: copy.title,
      updatedLabel: copy.updatedLabel,
      updated: new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(notice.lastUpdated)),
      updatedIso: notice.lastUpdated,
      intro: `What personal data ${svaion.shortName} receives through this website and by email, what we do with it, and your rights under the ${ACT.name}.`,
    },
    contentsLabel: copy.contentsLabel,
    sections,
    contact: {
      heading: copy.contactHeading,
      body: officer ? `Write to ${officer}, our Data Protection Officer.` : "Write to our Data Protection Officer.",
      email: { address: notice.contact.address, href: mailto(notice.contact, copy.emailSubject) },
    },
  };
}
