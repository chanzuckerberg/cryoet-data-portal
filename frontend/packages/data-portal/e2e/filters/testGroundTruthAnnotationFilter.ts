/* eslint-disable no-await-in-loop */

import apollo from '@apollo/client'
import { test } from '@playwright/test'
import { BROWSE_DATASETS_URL } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { getDatasetTableFilterValidator, validateTable } from './utils'

export function testGroundTruthAnnotationFilter(
  client: apollo.ApolloClient<apollo.NormalizedCacheObject>,
) {
  test.describe('Ground Truth Annotation', () => {
    test('should filter on click', async ({ page }) => {
      const url = new URL(BROWSE_DATASETS_URL)
      const params = url.searchParams
      params.set(QueryParams.GroundTruthAnnotation, 'true')

      const fetchData = getBrowseDatasets({
        client,
        params,
      })

      await page.goto(BROWSE_DATASETS_URL)

      await page.getByText('Ground Truth Annotation').click()
      await page.waitForURL(url.href)

      const { data } = await fetchData
      await validateTable({
        page,
        browseDatasetsData: data,
        validateRows: getDatasetTableFilterValidator(data),
      })
    })

    test('should filter when opening URL', async ({ page }) => {
      const url = new URL(BROWSE_DATASETS_URL)
      url.searchParams.set(QueryParams.GroundTruthAnnotation, 'true')
      const fetchData = getBrowseDatasets({
        client,
        params: url.searchParams,
      })

      await page.goto(url.href)

      const { data } = await fetchData
      await validateTable({
        page,
        browseDatasetsData: data,
        validateRows: getDatasetTableFilterValidator(data),
      })
    })

    test('should disable filter on click', async ({ page }) => {
      const fetchData = getBrowseDatasets({ client })

      const url = new URL(BROWSE_DATASETS_URL)

      const params = url.searchParams
      params.set(QueryParams.GroundTruthAnnotation, 'true')

      await page.goto(url.href)

      await page.getByText('Ground Truth Annotation').click()
      await page.waitForURL(BROWSE_DATASETS_URL)

      const { data } = await fetchData
      await validateTable({
        page,
        browseDatasetsData: data,
        validateRows: getDatasetTableFilterValidator(data),
      })
    })
  })
}
