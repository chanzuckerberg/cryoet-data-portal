import { createContext, useContext } from 'react'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export type DownloadModalType = 'dataset' | 'runs'

export type TomogramResolution =
  GetRunByIdQuery['runs'][number]['tomogram_stats'][number]['tomogram_resolutions'][number]

export interface DownloadModalContextValue {
  allTomogramProcessing?: string[]
  allTomogramResolutions?: TomogramResolution[]
  datasetId?: number
  fileSize?: number
  httpsPath?: string
  runName?: string
  s3DatasetPrefix?: string
  s3TomogramPrefix?: string
  s3TomogramVoxelPrefix?: string
  showAllAnnotations?: boolean
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
