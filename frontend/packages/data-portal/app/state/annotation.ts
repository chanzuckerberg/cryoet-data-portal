import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

import { AnnotationShape } from 'app/types/gql/runPageTypes'

const selectedAnnotationAtom = atom<AnnotationShape | null>(null)

export function useSelectedAnnotationShape() {
  const [selectedAnnotationShape, setSelectedAnnotationShape] = useAtom(
    selectedAnnotationAtom,
  )

  return useMemo(
    () => ({
      selectedAnnotationShape,
      setSelectedAnnotationShape,
    }),
    [selectedAnnotationShape, setSelectedAnnotationShape],
  )
}
