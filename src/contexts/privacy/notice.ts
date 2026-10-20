import { svaion } from "../company/svaion";
import { definePrivacyNotice } from "./model";

/**
 * How Svaion handles personal data. Before launch, a lawyer reviews it and the CEO and COO sign it off.
 * The CTO confirms the AI facts. The founders confirm the 12-month inquiry retention.
 */
export const privacyNotice = definePrivacyNotice(svaion, {
  controller: svaion.legalName,
  contact: svaion.channels.privacy,
  dataProtectionOfficer: { name: null },
  lastUpdated: "2026-10-20",
  website: { cookies: [], analytics: [], forms: [], thirdParty: [] },
  activities: [
    {
      id: "visit",
      personalData: ["your IP address", "your browser", "the page you asked for", "the time of the request"],
      purposes: ["Deliver this website.", "Keep it secure."],
      lawfulBases: [{ kind: "legitimate-interest", statement: "Our legitimate interest in keeping this website available and secure." }],
      retention: [{ applies: "Request logs", period: "Kept by the hosting provider only as long as it needs them for security, then deleted." }],
      processors: ["hosting"],
    },
    {
      id: "email",
      personalData: ["your name", "your email address", "your message", "any attachments"],
      purposes: ["Reply to you.", "Scope and quote the work you ask about.", "Deliver and support the work your business engages us for."],
      lawfulBases: [
        { kind: "pre-contract", statement: "Steps you ask us to take before a contract, such as answering your inquiry or preparing a quote." },
        { kind: "contract", statement: "A contract with you." },
        { kind: "legitimate-interest", statement: "Our legitimate interest in answering messages sent to us and in working with the people at our clients." },
      ],
      retention: [
        { applies: "Inquiries that don't lead to an engagement", period: "Deleted within 12 months of the last message." },
        { applies: "Engagement records", period: "Kept for the engagement, then for as long as Philippine law requires." },
      ],
      processors: ["email", "ai"],
    },
  ],
  ai: {
    tasks: ["draft replies", "analyze documents you send for a project"],
    review: "A named person at Svaion reviews what the tool produces before it is sent or acted on.",
    training: "We use only AI providers whose terms bar them from training their models on the data we send.",
    decidesAlone: false,
  },
  processors: [
    { kind: "hosting", service: "Website hosting", role: "Delivers this website and keeps its request logs." },
    { kind: "email", service: "Email", role: "Carries and stores messages to and from our addresses." },
    { kind: "ai", service: "AI tools", role: "Help draft and analyze, as described above." },
  ],
  sellsPersonalData: false,
  transfersAbroad: true,
  rights: [
    { id: "informed", name: "To be informed", description: "You can know whether we process your personal data, why, and how. This notice is part of that." },
    { id: "object", name: "To object", description: "You can object to the processing of your personal data, including for direct marketing or profiling." },
    { id: "access", name: "To access", description: "You can get a copy of the personal data we hold about you, where it came from, and who has received it." },
    { id: "rectification", name: "To rectification", description: "You can have personal data about you corrected when it is wrong or incomplete." },
    { id: "erasure", name: "To erasure or blocking", description: "You can have personal data about you blocked or deleted when it is outdated, false, unlawfully obtained, or no longer needed." },
    { id: "damages", name: "To damages", description: "You can be compensated for harm caused by inaccurate or unlawful use of your personal data." },
    { id: "portability", name: "To data portability", description: "You can get the personal data you gave us in a common electronic format, to use elsewhere." },
    { id: "complaint", name: "To file a complaint", description: "You can complain to the National Privacy Commission if you believe we have violated your rights." },
  ],
});
