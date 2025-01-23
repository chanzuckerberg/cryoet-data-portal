import { createContext, useContext } from 'react'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import { BaseAnnotation } from 'app/state/annotation'
import { TomogramV2 } from 'app/types/gql/runPageTypes'

export type DownloadModalType = 'dataset' | 'runs' | 'annotation'

export interface DownloadModalContextValue {
  annotationToDownload?: BaseAnnotation
  tomogramToDownload?: TomogramV2

  allAnnotationFiles?: GetRunByIdQuery['annotation_files']
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
  tomogramVoxelId?: number
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
