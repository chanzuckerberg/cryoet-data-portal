import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { E2E_CONFIG } from 'e2e/constants'

import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'
import {
  getAnnotationCodeSnippet,
  getTomogramCodeSnippet,
} from 'app/components/Download/APIDownloadTab'
import { getAwsCommand } from 'app/components/Download/AWSDownloadTab'
import { getCurlCommand } from 'app/components/Download/CurlDownloadTab'
import { getDefaultFileFormat } from 'app/components/Download/FileFormatDropdown'
import { QueryParams } from 'app/constants/query'
import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { getRunByIdV2 } from 'app/graphql/getRunByIdV2.server'
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
  }: {
    tab?: string
    step?: string
    config?: string
    annotationFile?: { annotation: { id: string }; shape_type: string }
    tomogram?: { id: number; sampling: number; processing: string }
    fileFormat?: string
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
    params.append(QueryParams.ReferenceTomogramId, String(tomogram!.id))
    params.append(
      QueryParams.AnnotationId,
      String(annotationFile.annotation.id),
    )
    params.append(QueryParams.ObjectShapeType, annotationFile.shape_type)
  } else if (tomogram) {
    params.append(QueryParams.DownloadTomogramId, String(tomogram.id))
  }

  if (fileFormat) {
    params.append(QueryParams.FileFormat, fileFormat)
  }

  if (tab) {
    params.append(QueryParams.DownloadTab, tab)
  }

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
  return getRunByIdV2({
    client,
    id: +E2E_CONFIG.runId,
    annotationsPage: 1,
    params: new URLSearchParams(),
  })
}

export function getTomogramDownloadCommand({
  data,
  fileFormat,
  tab,
}: {
  data: GetRunByIdV2Query
  fileFormat?: string
  tab: DownloadTab
}): string {
  const activeTomogram = data.tomograms[0]

  switch (tab) {
    case DownloadTab.API:
      return getTomogramCodeSnippet(activeTomogram?.id, fileFormat)
    case DownloadTab.AWS:
      return getAwsCommand({
        s3Path: activeTomogram.s3MrcFile!,
        s3Command: 'cp',
      })
    case DownloadTab.Curl:
      return getCurlCommand(activeTomogram.httpsMrcFile!)
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
  data: GetRunByIdV2Query
  tab: DownloadTab
}): string {
  const annotationShape = data.annotationShapes[0]
  const fileFormat = getDefaultFileFormat(
    annotationShape.annotationFiles.edges.map((file) => file.node.format),
  )!

  switch (tab) {
    case DownloadTab.PortalCLI: // TODO(bchu): Update.
    case DownloadTab.API:
      return getAnnotationCodeSnippet(
        annotationShape.annotation!.id.toString(),
        fileFormat,
      )
    case DownloadTab.AWS:
      return getAwsCommand({
        s3Path: annotationShape.annotationFiles.edges.find(
          (file) => file.node.format === fileFormat,
        )!.node.format,
        s3Command: 'cp',
      })
    case DownloadTab.Curl:
      return getCurlCommand(
        annotationShape.annotationFiles.edges.find(
          (file) => file.node.format === fileFormat,
        )!.node.httpsPath,
      )
    case DownloadTab.Download:
      return ''
    default:
      throw new Error('Invalid tab')
  }
}
