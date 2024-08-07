import { createContext, useContext } from 'react'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import { BaseAnnotation } from 'app/state/annotation'

export type DownloadModalType = 'dataset' | 'runs' | 'annotation'

export type TomogramResolution =
  GetRunByIdQuery['runs'][number]['tomogram_stats'][number]['tomogram_resolutions'][number]

export interface DownloadModalContextValue {
  activeAnnotation?: BaseAnnotation | null
  activeTomogramResolution?: TomogramResolution | null
  allTomogramProcessing?: string[]
  allTomogramResolutions?: TomogramResolution[]
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
