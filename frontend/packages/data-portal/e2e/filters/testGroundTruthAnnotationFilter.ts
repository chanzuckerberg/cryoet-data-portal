import { test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { TableValidator } from 'e2e/pageObjects/filters/types'

import { QueryParams } from 'app/constants/query'

import { goTo } from './utils'

export function testGroundTruthAnnotationFilter({
  url,
  validateTable,
}: {
  url: string
  validateTable: TableValidator
}) {
  test.describe('Ground Truth Annotation', () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    test('should filter on click', async ({ page }) => {
      const expectedUrl = new URL(url)
      const params = expectedUrl.searchParams
      params.set(QueryParams.GroundTruthAnnotation, 'true')

      await goTo(page, url)
      await page.getByText('Ground Truth Annotation').click()
      await page.waitForURL(expectedUrl.href)
      await validateTable({
        client,
        page,
        params,
      })
    })

    test('should filter when opening URL', async ({ page }) => {
      const expectedUrl = new URL(url)
      expectedUrl.searchParams.set(QueryParams.GroundTruthAnnotation, 'true')

      await goTo(page, expectedUrl.href)
      await validateTable({
        client,
        page,
        params: expectedUrl.searchParams,
      })
    })

    test('should disable filter on click', async ({ page }) => {
      const expectedUrl = new URL(url)
      const params = expectedUrl.searchParams
      params.set(QueryParams.GroundTruthAnnotation, 'true')

      await goTo(page, expectedUrl.href)
      await page.getByText('Ground Truth Annotation').click()
      await page.waitForURL(url)

      await validateTable({
        client,
        page,
      })
    })
  })
}
