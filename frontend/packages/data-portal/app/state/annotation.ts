import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export type BaseAnnotation =
  GetRunByIdQuery['annotation_files'][number]['annotation']

export type AnnotationFile = GetRunByIdQuery['annotation_files'][number]

export type AnnotationRow = BaseAnnotation &
  Omit<AnnotationFile, 'annotation'> & {
    fileId: number
  }

const activeAnnotationAtom = atom<AnnotationRow | null>(null)

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
