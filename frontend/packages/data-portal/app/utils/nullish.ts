/** Checks nullish and updates the type. */
export function isDefined<T>(x: T): x is NonNullable<T> {
  return x != null
}
