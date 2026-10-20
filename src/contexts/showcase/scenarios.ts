import { defineScenarios } from "./model";

/** Approved by the CTO for the homepage (19 October 2026). Names and figures are fictional. */
export const scenarios = defineScenarios([
  {
    id: "quote",
    label: "Draft a quote",
    request: "Can you quote 40 units of the 2HP pump, delivered to Cebu by Friday?",
    draft: {
      message: "Draft quote Q-1042 prepared from the 2026 price list: ₱186,400 including delivery. Waiting for approval.",
      disclosure: "AI-assisted draft. Source: Price list 2026, page 4.",
    },
    signOff: "Approved and sent by Rina Santos, sales lead, 10:42.",
    illustrative: true,
  },
  {
    id: "ticket",
    label: "Route a request",
    request: "The point-of-sale system at the Makati branch freezes at checkout.",
    draft: {
      message: "Logged as request 3312, priority high, and routed to field support with two similar past cases attached.",
      disclosure: "AI-assisted routing. Priority set by your support rules.",
    },
    signOff: "Accepted by Jun Dela Cruz, technician. Visit scheduled 14:00.",
    illustrative: true,
  },
  {
    id: "docs",
    label: "Answer from documents",
    request: "What is the warranty on the 2HP pump?",
    draft: {
      message: "Two years on parts and one year on labor, according to the approved warranty policy.",
      disclosure: "Answered from approved company documents. Source: Warranty policy 2026, section 3.",
    },
    signOff: "Sent to the customer. Reviewed by your support lead this week.",
    illustrative: true,
  },
]);
