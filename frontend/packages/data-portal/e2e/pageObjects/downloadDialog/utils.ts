import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { E2E_CONFIG } from 'e2e/constants'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import {
  getAnnotationCodeSnippet,
  getTomogramCodeSnippet,
} from 'app/components/Download/APIDownloadTab'
import { getAwsCommand } from 'app/components/Download/AWSDownloadTab'
import { getCurlCommand } from 'app/components/Download/CurlDownloadTab'
import { QueryParams } from 'app/constants/query'
import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { getRunById } from 'app/graphql/getRunById.server'
import { DownloadTab } from 'app/types/download'

export function skipClipboardTestsForWebkit(browserName: string) {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(
    browserName === 'webkit',
    'Skipping for safari because clipboard permissions are not availabe.',
  )
}

export function constructDialogUrl(
  url: URL | string,
  {
    tab,
    step,
    config,
    annotationFile,
    tomogram,
    fileFormat,
    multipleTomograms = false,
  }: {
    tab?: string
    step?: string
    config?: string
    annotationFile?: { annotation: { id: string }; shape_type: string }
    tomogram?: { id: number; sampling: number; processing: string }
    fileFormat?: string
    multipleTomograms?: boolean
  },
): URL {
  const expectedUrl = new URL(url)
  const params = expectedUrl.searchParams

  if (step) {
    params.append(QueryParams.DownloadStep, step)
  }

  if (config) {
    params.append(QueryParams.DownloadConfig, config)
  }

  if (annotationFile) {
    if (multipleTomograms) {
      params.append(QueryParams.ReferenceTomogramId, String(tomogram!.id))
    }
    params.append(
      QueryParams.AnnotationId,
      String(annotationFile.annotation.id),
    )
    params.append(QueryParams.ObjectShapeType, annotationFile.shape_type)
  }

  if (tomogram) {
    if (multipleTomograms) {
      params.append(QueryParams.DownloadTomogramId, String(tomogram.id))
    } else {
      params.append(QueryParams.TomogramSampling, String(tomogram.sampling))
      params.append(QueryParams.TomogramProcessing, tomogram.processing)
    }
  }

  if (fileFormat) {
    params.append(QueryParams.FileFormat, fileFormat)
  }

  if (tab) {
    params.append(QueryParams.DownloadTab, tab)
  }

  params.append(
    multipleTomograms ? 'enable-feature' : 'disable-feature',
    'multipleTomograms',
  )

  return expectedUrl
}

export function fetchTestSingleDataset(
  client: ApolloClient<NormalizedCacheObject>,
) {
  return getDatasetById({ client, id: +E2E_CONFIG.datasetId })
}

export function fetchTestSingleRun(
  client: ApolloClient<NormalizedCacheObject>,
) {
  return getRunById({ client, id: +E2E_CONFIG.runId, annotationsPage: 1 })
}

export function getTomogramDownloadCommand({
  data,
  fileFormat,
  tab,
}: {
  data: GetRunByIdQuery
  fileFormat?: string
  tab: DownloadTab
}): string {
  const tomogram = data.runs[0].tomogram_voxel_spacings[0].tomograms[0]
  const activeTomogram = data.tomograms_for_download.find((tomo) => {
    return (
      tomo.voxel_spacing === tomogram.voxel_spacing &&
      tomo.processing === tomogram.processing
    )
  })

  switch (tab) {
    case DownloadTab.API:
      return getTomogramCodeSnippet(activeTomogram?.id, fileFormat)
    case DownloadTab.AWS:
      return getAwsCommand({
        s3Path: activeTomogram?.s3_mrc_scale0,
        s3Command: 'cp',
      })
    case DownloadTab.Curl:
      return getCurlCommand(activeTomogram?.https_mrc_scale0)
    case DownloadTab.Download:
      return ''
    default:
      throw new Error('Invalid tab')
  }
}

export function getAnnotationDownloadCommand({
  data,
  tab,
}: {
  data: GetRunByIdQuery
  tab: DownloadTab
}): string {
  const annotationFile = data.annotation_files[0]
  const fileFormat = annotationFile!.format

  switch (tab) {
    case DownloadTab.API:
      return getAnnotationCodeSnippet(
        annotationFile.annotation.id.toString(),
        fileFormat,
      )
    case DownloadTab.AWS:
      return getAwsCommand({
        s3Path: annotationFile!.annotation.files.find(
          (file) => file.format === fileFormat,
        )!.s3_path,
        s3Command: 'cp',
      })
    case DownloadTab.Curl:
      return getCurlCommand(
        annotationFile!.annotation.files.find(
          (file) => file.format === fileFormat,
        )!.https_path,
      )
    case DownloadTab.Download:
      return ''
    default:
      throw new Error('Invalid tab')
  }
}
