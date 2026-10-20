import { invariant } from "../shared/invariant";
import { capitalize, joinSeries } from "../shared/text";

export interface WeekRange {
  readonly from: number;
  readonly to: number;
}

export function weekRange(from: number, to: number): WeekRange {
  invariant(Number.isInteger(from) && Number.isInteger(to), "A week range counts whole weeks.");
  invariant(from > 0 && from < to, "A week range runs forward from at least one week.");
  return Object.freeze({ from, to });
}

/** "8–12 weeks", with the en dash the guidelines use for ranges. */
export function formatWeeks(range: WeekRange): string {
  return `${range.from}–${range.to} weeks`;
}

export interface MvpWindow {
  readonly weeks: WeekRange;
}

/** The MVP window is only ever stated as an approximation, never as a deadline. */
export function approximately(window: MvpWindow): string {
  return `approximately ${formatWeeks(window.weeks)}`;
}

/** The approved timing message. */
export function timingMessage(window: MvpWindow): string {
  return `Launch a focused MVP in ${approximately(window)}, depending on scope.`;
}

export type ServiceLineId = "web-applications" | "mobile-ready-platforms" | "business-systems" | "ai-enabled-solutions";

export interface ServiceLine {
  readonly id: ServiceLineId;
  readonly name: string;
  readonly summary: string;
}

export interface AudienceSegment {
  readonly id: string;
  readonly name: string;
  /** How the segment reads mid-sentence, e.g. "companies modernizing manual processes". */
  readonly phrase: string;
  readonly benefit: string;
}

export interface Offering {
  readonly serviceLines: readonly ServiceLine[];
  readonly audience: readonly AudienceSegment[];
  readonly mvpWindow: MvpWindow;
  readonly commitments: readonly string[];
}

const SERVICE_LINES: readonly ServiceLineId[] = ["web-applications", "mobile-ready-platforms", "business-systems", "ai-enabled-solutions"];

export function defineOffering(offering: Offering): Offering {
  invariant(
    offering.serviceLines.map((line) => line.id).join() === SERVICE_LINES.join(),
    "Svaion has exactly four service lines, in the guidelines' order.",
  );
  invariant(offering.audience.length > 0, "An offering serves at least one audience segment.");
  invariant(new Set(offering.audience.map((s) => s.id)).size === offering.audience.length, "Audience segments are distinct.");
  invariant(new Set(offering.commitments).size === offering.commitments.length, "Engagement commitments are distinct.");
  return Object.freeze(offering);
}

/** A service line's name as it reads mid-sentence: "web applications", but "AI-enabled solutions". */
function inRunningText(name: string): string {
  return /^[A-Z]{2}/.test(name) ? name : name.charAt(0).toLowerCase() + name.slice(1);
}

/** "Web applications, mobile-ready platforms, business systems, and AI-enabled solutions" */
export function serviceLineSeries(offering: Offering): string {
  return capitalize(joinSeries(offering.serviceLines.map((line) => inRunningText(line.name))));
}

/** "Philippine SMEs, startup founders, …, and selected international clients" */
export function audienceSeries(offering: Offering): string {
  return capitalize(joinSeries(offering.audience.map((segment) => segment.phrase)));
}
