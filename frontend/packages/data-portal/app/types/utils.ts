export type NonUndefined<T> = T extends undefined ? never : T

/** Guarantees that a switch is exhaustive when called with the switch value in the default block. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function checkExhaustive(_: never): never {
  throw new Error('It is impossible to reach this line of code.')
}
