/**
 * Type definitions exported from useHydrateAtoms.d.ts
 */

import { WritableAtom } from 'jotai'

export type AnyWritableAtom = WritableAtom<unknown, any[], any>
export type AtomTuple<A = AnyWritableAtom, V = unknown> = readonly [A, V]
