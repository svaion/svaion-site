/**
 * Privacy notice wording that is not a domain fact: headings, labels, and the sentences that join the facts.
 * Needs a lawyer's review and CEO and COO sign-off before launch, and again for any change.
 */
export const copy = {
  title: "Privacy notice",
  updatedLabel: "Last updated",
  contentsLabel: "On this page",
  emailSubject: "Privacy request",
  sections: {
    who: "Who we are",
    visit: "When you visit this website",
    email: "When you email us",
    ai: "How we use AI tools",
    sharing: "Who else handles it",
    retention: "How long we keep it",
    rights: "Your rights",
    changes: "Changes to this notice",
  },
  /** How the website names each kind of website collection in "This website has no …". */
  collectionKinds: {
    cookies: "cookies",
    analytics: "analytics",
    forms: "forms",
    thirdParty: "third-party scripts or fonts",
  },
  declaredLead: "It uses:",
  purposesLead: "We use this data to:",
  basisLead: "Our lawful basis is",
  basesLead: "Our lawful basis is one of these:",
  sharing: {
    neverSell: "We never sell personal data.",
    processorsLead: "These providers handle it for us, under contract and only on our instructions:",
    disclosure: "We share personal data with anyone else only when the law requires it.",
    abroad: "Some of these providers may store data outside the Philippines. We remain responsible for it wherever it is kept.",
  },
  aiDecidesAlone: "No AI tool makes a decision about you on its own.",
  rightsHowTo: "To use any of them, email",
  changes: "When we change this notice, we update the date at the top of this page.",
  contactHeading: "Questions about your data?",
} as const;
