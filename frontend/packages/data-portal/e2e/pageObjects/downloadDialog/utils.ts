import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { E2E_CONFIG } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'
import { getDatasetById } from 'app/graphql/getDatasetById.server'

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
    tomogram,
    fileFormat,
  }: {
    tab?: string
    step?: string
    config?: string
    tomogram?: { sampling: number; processing: string }
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

  if (tomogram) {
    params.append(QueryParams.TomogramSampling, String(tomogram.sampling))
    params.append(QueryParams.TomogramProcessing, tomogram.processing)
  }

  if (tab) {
    params.append(QueryParams.DownloadTab, tab)
  }

  if (fileFormat) {
    params.append(QueryParams.FileFormat, fileFormat)
  }

  return expectedUrl
}

export function fetchTestSingleDataset(
  client: ApolloClient<NormalizedCacheObject>,
) {
  return getDatasetById({ client, id: +E2E_CONFIG.datasetId })
}
