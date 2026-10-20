/**
 * Homepage wording that is not a domain fact: section headings, calls to action, and labels.
 * Headings beyond the approved messages were signed off by the CEO and COO on 19 October 2026;
 * changes here need the same sign-off.
 */
export const copy = {
  skipLink: "Skip to content",
  nav: {
    homeLabel: "Svaion home",
    navLabel: "Main",
    menuOpenLabel: "Open menu",
    menuCloseLabel: "Close menu",
    links: [
      { label: "Services", href: "#services" },
      { label: "How we work", href: "#how" },
      { label: "Who it's for", href: "#for" },
      { label: "FAQs", href: "#faq" },
    ],
  },
  startProject: { label: "Start a project", href: "#contact" },
  seeHowWeWork: { label: "See how we work", href: "#how" },
  hero: {
    reviewPromise: "Engineers review architecture, security, and code quality on every release.",
    drawingTitle: "The ai ligature from the Svaion wordmark, drawn with its construction lines; the dot switches on",
    drawingCaption: "The ai inside the wordmark. One shared stroke for human judgment and AI; the dot is the signal.",
  },
  demo: {
    intro:
      "AI-assisted. Human-led. The assistant drafts and answers from approved company documents; a person you name reviews and approves before anything counts.",
    tablistLabel: "What AI-assisted work looks like",
  },
  contact: {
    lead: "Talk to an engineer, not a sales script.",
    heading: "Email Svaion to start the conversation.",
    emailCta: "Email us",
    emailSubject: "New project",
  },
  audience: {
    heading: "Built for your kind of business.",
    listLabel: "Who Svaion builds for",
  },
  engagement: {
    heading: "AI-assisted speed. Human engineering accountability.",
    paragraphs: [
      "We use AI to accelerate delivery while engineers review architecture, security, and code quality on every release.",
      "Accountable professionals, not an automated code generator, are responsible for your project from the first conversation to long-term support.",
    ],
    planNote: "To a focused MVP, depending on scope. Larger systems are planned in stages.",
  },
  process: {
    heading: "How we work.",
    intro: "One path, four nodes. You see where the project is at every step.",
  },
  services: {
    heading: "What we build.",
    intro: "Svaion turns business problems and product ideas into working technology.",
  },
  ledger: {
    heading: "Every system ships with a name on it.",
    intro: "A clear line between what the AI does and who answers for it, on every engagement.",
    columns: ["What the AI does", "Who answers for it"] as const,
  },
  faq: {
    heading: "FAQs",
    contactLabel: "Talk to an engineer",
    meaning: {
      question: "What does AI-assisted, human-led engineering mean?",
      answer:
        "We use AI to accelerate delivery while engineers review architecture, security, and code quality. Accountable professionals, not an automated code generator, are responsible for your project.",
    },
    durationQuestion: "How long does a project take?",
    stagedPlan: "Larger systems are planned in stages after the discovery phase, with a written scope for each.",
    team: {
      question: "Do we need our own development team?",
      answer:
        "No. Svaion exists so you can build reliable software faster without establishing a complete internal development team. You need someone who knows the business and can approve decisions.",
    },
    buildQuestion: "What do you build?",
    buildProcess: "through an efficient, human-led engineering process.",
    aiUse: {
      question: "How is AI used in what we receive?",
      answer:
        "AI-assisted or AI-generated content is clearly identified, and uncertain AI output is never presented as established fact. Assistants we build answer from approved company documents and show their sources.",
    },
    audienceQuestion: "Who is Svaion for?",
    tools: {
      question: "Do we have to replace the tools we use today?",
      answer:
        "Not as a rule. Many projects start by connecting to the records and channels your team already uses, and replace only what no longer serves the workflow.",
    },
    startQuestion: "How do we start?",
    startAfterEmail: "with the problem or the product idea. An engineer reads it and replies with questions, then we agree a scope for the discovery phase.",
  },
  footer: {
    emailHeading: "Email",
  },
  /** Midnight, the brand ground; colors the browser chrome on mobile. */
  themeColor: "#0B1020",
} as const;
