import { invariant } from "../shared/invariant";

export const ILLUSTRATIVE_NOTICE = "Illustrative example. Names and figures are fictional.";

export interface AssistantDraft {
  readonly message: string;
  readonly disclosure: string;
}

export interface Scenario {
  readonly id: string;
  readonly label: string;
  readonly request: string;
  readonly draft: AssistantDraft;
  readonly signOff: string;
  /** Scenarios use fictional names and figures; they are never case studies. */
  readonly illustrative: true;
}

const DISCLOSES_AI = /AI-assisted|approved company documents/;

export function defineScenarios(scenarios: readonly Scenario[]): readonly Scenario[] {
  for (const scenario of scenarios) {
    invariant(DISCLOSES_AI.test(scenario.draft.disclosure), `The assistant draft in "${scenario.label}" must disclose that it is AI-assisted.`);
    invariant(scenario.signOff.trim(), `"${scenario.label}" ends with a person's sign-off.`);
    invariant(scenario.illustrative === true, `"${scenario.label}" must be marked illustrative.`);
  }
  invariant(new Set(scenarios.map((scenario) => scenario.id)).size === scenarios.length, "Scenario ids are distinct.");
  return Object.freeze(scenarios);
}
