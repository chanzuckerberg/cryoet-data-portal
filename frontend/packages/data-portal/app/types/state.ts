/**
 * Type definitions exported from useHydrateAtoms.d.ts
 */

import { WritableAtom } from 'jotai'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyWritableAtom = WritableAtom<unknown, any[], any>
export type AtomTupleWithValue<A = AnyWritableAtom, V = unknown> = readonly [
  A,
  V,
]
