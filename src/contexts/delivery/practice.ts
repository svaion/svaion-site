import { approximately } from "../offering/model";
import { offering } from "../offering/catalog";
import { defineAccountability, definePath } from "./model";

export const deliveryPath = definePath([
  {
    name: "Discover",
    description: "We map the workflow, the data, and the outcome you need, and agree a written scope before any code.",
  },
  {
    name: "Build",
    description: "Weekly releases you can use. AI accelerates the work; engineers review architecture, security, and code quality on each one.",
  },
  {
    name: "Launch",
    description: `A focused MVP in ${approximately(offering.mvpWindow)}, depending on scope, with your team trained on it.`,
  },
  {
    name: "Support",
    description: "Long-term support, measurable improvement, and a system your team can keep running.",
  },
]);

export const accountability = defineAccountability([
  { aiActivity: "Drafts code and tests", accountablePerson: "A Svaion engineer reviews, runs, and merges it. Their name is on the release." },
  { aiActivity: "Proposes an architecture", accountablePerson: "The lead engineer decides, and writes down why." },
  { aiActivity: "Summarizes documents and data", accountablePerson: "An analyst checks the sources before anyone acts on it." },
  { aiActivity: "Answers routine customer questions", accountablePerson: "Your team sets the limits, sees every conversation, and takes over the hard ones." },
  { aiActivity: "Flags an unusual event", accountablePerson: "An on-call engineer answers, by name." },
  { aiActivity: "Estimates the effort", accountablePerson: "We quote it, and we stand behind the estimate." },
]);
