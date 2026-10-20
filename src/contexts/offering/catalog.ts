import { approximately, defineOffering, weekRange, type MvpWindow } from "./model";

const mvpWindow: MvpWindow = { weeks: weekRange(8, 12) };

export const offering = defineOffering({
  mvpWindow,
  serviceLines: [
    {
      id: "web-applications",
      name: "Web applications",
      summary: "Systems your team runs the business on, built to be maintained: order processing, inventory, customer portals.",
    },
    {
      id: "mobile-ready-platforms",
      name: "Mobile-ready platforms",
      summary: "One codebase that works in the office, on the shop floor, and in the field, designed for small screens from the first sketch.",
    },
    {
      id: "business-systems",
      name: "Business systems",
      summary: "Reduce manual order processing with a system designed around your workflow, connected to the records you already keep.",
    },
    {
      id: "ai-enabled-solutions",
      name: "AI-enabled solutions",
      summary: "Assistants that answer from approved company documents and show their sources, inside the systems you already use.",
    },
  ],
  audience: [
    {
      id: "philippine-smes",
      name: "Philippine SMEs",
      phrase: "Philippine SMEs",
      benefit: "Reliable software without building a complete internal development team.",
    },
    {
      id: "startup-founders",
      name: "Startup founders",
      phrase: "startup founders",
      benefit: `From product idea to a focused MVP in ${approximately(mvpWindow)}.`,
    },
    {
      id: "operations-leaders",
      name: "Operations leaders",
      phrase: "operations leaders",
      benefit: "Reduce manual order processing with a system designed around your workflow.",
    },
    {
      id: "business-owners",
      name: "Business owners",
      phrase: "business owners",
      benefit: "Dependable systems you keep, with long-term support.",
    },
    {
      id: "modernizing-manual-processes",
      name: "Modernizing manual processes",
      phrase: "companies modernizing manual processes",
      benefit: "Spreadsheets and paper trails turned into secure, maintainable systems.",
    },
    {
      id: "international-clients",
      name: "Selected international clients",
      phrase: "selected international clients",
      benefit: "A globally capable team, working with chosen clients abroad.",
    },
  ],
  commitments: [
    "A named lead engineer",
    "Architecture, security, and code review on every release",
    "Secure, maintainable, documented code",
    "AI-assisted work clearly identified",
    "Measurable improvement, reported",
    "Long-term support",
  ],
});
