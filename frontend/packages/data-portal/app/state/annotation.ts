import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

import { AnnotationShape } from 'app/types/gql/runPageTypes'

const activeAnnotationAtom = atom<AnnotationShape | null>(null)

export function useAnnotation() {
  const [activeAnnotation, setActiveAnnotation] = useAtom(activeAnnotationAtom)

  return useMemo(
    () => ({
      activeAnnotation,
      setActiveAnnotation,
    }),
    [activeAnnotation, setActiveAnnotation],
  )
}
