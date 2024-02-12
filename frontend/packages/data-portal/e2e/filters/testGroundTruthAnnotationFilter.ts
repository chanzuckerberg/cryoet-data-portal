import { test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { BROWSE_DATASETS_URL } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { getDatasetTableFilterValidator, validateTable } from './utils'

export function testGroundTruthAnnotationFilter() {
  test.describe('Ground Truth Annotation', () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    test('should filter on click', async ({ page }) => {
      const expectedUrl = new URL(BROWSE_DATASETS_URL)
      const params = expectedUrl.searchParams
      params.set(QueryParams.GroundTruthAnnotation, 'true')

      const fetchExpectedData = getBrowseDatasets({
        client,
        params,
      })

      await page.goto(BROWSE_DATASETS_URL)
      await page.getByText('Ground Truth Annotation').click()
      await page.waitForURL(expectedUrl.href)

      const { data } = await fetchExpectedData
      await validateTable({
        page,
        browseDatasetsData: data,
        validateRows: getDatasetTableFilterValidator(data),
      })
    })

    test('should filter when opening URL', async ({ page }) => {
      const expectedUrl = new URL(BROWSE_DATASETS_URL)
      expectedUrl.searchParams.set(QueryParams.GroundTruthAnnotation, 'true')
      const fetchExpectedData = getBrowseDatasets({
        client,
        params: expectedUrl.searchParams,
      })

      await page.goto(expectedUrl.href)

      const { data } = await fetchExpectedData
      await validateTable({
        page,
        browseDatasetsData: data,
        validateRows: getDatasetTableFilterValidator(data),
      })
    })

    test('should disable filter on click', async ({ page }) => {
      const fetchExpectedData = getBrowseDatasets({ client })

      const expectedUrl = new URL(BROWSE_DATASETS_URL)
      const params = expectedUrl.searchParams
      params.set(QueryParams.GroundTruthAnnotation, 'true')

      await page.goto(expectedUrl.href)
      await page.getByText('Ground Truth Annotation').click()
      await page.waitForURL(BROWSE_DATASETS_URL)

      const { data } = await fetchExpectedData
      await validateTable({
        page,
        browseDatasetsData: data,
        validateRows: getDatasetTableFilterValidator(data),
      })
    })
  })
}
