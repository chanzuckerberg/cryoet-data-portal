import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export type BaseAnnotation =
  GetRunByIdQuery['runs'][number]['annotation_table'][number]['annotations'][number]

export type AnnotationFile =
  GetRunByIdQuery['runs'][number]['annotation_table'][number]['annotations'][number]['files'][number]

export type Annotation = BaseAnnotation & AnnotationFile

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
