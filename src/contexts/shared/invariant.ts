/** Content that breaks a rule of the domain. It is thrown while the site builds, never in a visitor's browser. */
export class DomainError extends Error {
  override name = "DomainError";
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new DomainError(message);
}
