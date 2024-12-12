import { Provider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { ReactNode } from 'react'

import { AtomTuple } from 'app/types/state'

function HydrateAtoms({
  initialValues,
  children,
}: {
  initialValues: AtomTuple[]
  children: ReactNode
}) {
  useHydrateAtoms(initialValues)
  return children
}

/**
 * Renders component tree with initial values for global state. The
 * `initialValues` prop should be an array of tuple pairs where the first
 * element is the atom definition and the second element is the initial value of
 * the atom.
 */
export function HydrateAtomsProvider({
  initialValues,
  children,
}: {
  initialValues: AtomTuple[]
  children: ReactNode
}) {
  return (
    <Provider>
      <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
    </Provider>
  )
}
