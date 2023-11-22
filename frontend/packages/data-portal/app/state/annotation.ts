import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

type RootAnnotation =
  GetRunByIdQuery['runs'][number]['annotation_table'][number]['annotations'][number]

type AnnotationFile = RootAnnotation['files'][number]

export type Annotation = RootAnnotation & AnnotationFile

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
