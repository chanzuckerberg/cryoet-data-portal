import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export type Annotation =
  GetRunByIdQuery['runs'][number]['annotation_table'][number]['annotations'][number]

const activeAnnotationAtom = atom<Annotation | null>(null)

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
