import { invariant } from "../shared/invariant";

export const STAGE_NAMES = ["Discover", "Build", "Launch", "Support"] as const;
export type StageName = (typeof STAGE_NAMES)[number];

export interface DeliveryStage {
  readonly name: StageName;
  readonly description: string;
}

/** Every engagement passes through all four stages, in order. */
export function definePath(stages: readonly DeliveryStage[]): readonly DeliveryStage[] {
  invariant(stages.map((stage) => stage.name).join() === STAGE_NAMES.join(), "The delivery path is Discover, Build, Launch, Support.");
  invariant(stages.every((stage) => stage.description.trim()), "Every delivery stage says what happens in it.");
  return Object.freeze(stages);
}

export interface AccountabilityRule {
  readonly aiActivity: string;
  readonly accountablePerson: string;
}

const NAMES_THE_AI = /^(the |an? )?AI\b/i;

/** AI-assisted, human-led: each thing the AI does is answered for by a person, never by the AI itself. */
export function defineAccountability(rules: readonly AccountabilityRule[]): readonly AccountabilityRule[] {
  for (const rule of rules) {
    invariant(rule.aiActivity.trim(), "An accountability rule names what the AI does.");
    invariant(rule.accountablePerson.trim(), `"${rule.aiActivity}" needs an accountable person.`);
    invariant(!NAMES_THE_AI.test(rule.accountablePerson), `"${rule.aiActivity}" must be answered for by a person, not the AI.`);
  }
  invariant(new Set(rules.map((rule) => rule.aiActivity)).size === rules.length, "Each AI activity has one accountability rule.");
  return Object.freeze(rules);
}
