import { createContext, useContext } from 'react'

import { AnnotationShape, TomogramV2 } from 'app/types/gql/runPageTypes'

export type DownloadModalType = 'dataset' | 'runs' | 'annotation'

export interface DownloadModalContextValue {
  annotationShapeToDownload?: AnnotationShape
  tomogramToDownload?: TomogramV2

  allAnnotationShapes?: AnnotationShape[]
  allTomograms?: TomogramV2[]
  allTomogramProcessing?: string[]
  datasetId?: number
  datasetTitle?: string
  fileSize?: number
  httpsPath?: string
  objectName?: string
  runId?: number
  runName?: string
  s3Path?: string
  tomogramId?: number
  type: DownloadModalType
}

export const DownloadModalContext =
  createContext<DownloadModalContextValue | null>(null)

export function useDownloadModalContext() {
  const value = useContext(DownloadModalContext)

  if (!value) {
    throw new Error(
      'useDownloadModal must be used within a DownloadModalContext',
    )
  }

  return value
}
