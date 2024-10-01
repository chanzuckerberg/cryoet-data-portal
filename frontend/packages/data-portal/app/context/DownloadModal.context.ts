import { createContext, useContext } from 'react'

import { BaseAnnotation } from 'app/state/annotation'
import { TomogramV2 } from 'app/types/gqlResponseTypes'

export type DownloadModalType = 'dataset' | 'runs' | 'annotation'

export interface DownloadModalContextValue {
  annotationToDownload?: BaseAnnotation
  tomogramToDownload?: TomogramV2

  allAnnotations?: BaseAnnotation[]
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
