import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { BROWSE_DATASETS_URL, E2E_CONFIG } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'

import { TableValidator } from './types'
import { goTo } from './utils'

export interface MultiInputFilter {
  label: string
  queryParam: QueryParams
  valueKey: keyof typeof E2E_CONFIG
}

function testFilter({
  buttonLabel,
  client,
  filter,
  hasMultipleFilters,
  validateTable,
}: {
  buttonLabel: string
  client: ApolloClient<NormalizedCacheObject>
  filter: MultiInputFilter
  hasMultipleFilters: boolean
  validateTable: TableValidator
}) {
  const value = E2E_CONFIG[filter.valueKey]

  test(`should filter by ${filter.label}`, async ({ page }) => {
    const expectedUrl = new URL(BROWSE_DATASETS_URL)
    const params = expectedUrl.searchParams
    params.append(filter.queryParam, value)

    await goTo(page, BROWSE_DATASETS_URL)

    // Open multi input filter
    await page.getByRole('button', { name: buttonLabel }).click()

    // Fill input
    // eslint-disable-next-line playwright/no-conditional-in-test
    const pageLabel = `${filter.label}${hasMultipleFilters ? ':' : ''}`
    await page.getByLabel(pageLabel).click()
    await page.getByLabel(pageLabel).fill(value)

    // Apply filter
    await page.getByRole('button', { name: 'Apply' }).click()
    await page.waitForURL(expectedUrl.href)

    await validateTable({
      client,
      page,
      params,
    })
  })

  test(`should filter by ${filter.label} when opening URL`, async ({
    page,
  }) => {
    const expectedUrl = new URL(BROWSE_DATASETS_URL)
    const params = expectedUrl.searchParams
    params.append(filter.queryParam, value)

    await goTo(page, expectedUrl.href)
    await validateTable({
      client,
      page,
      params,
    })
  })

  test(`should clear ${filter.label} filter`, async ({ page }) => {
    const expectedUrl = new URL(BROWSE_DATASETS_URL)
    expectedUrl.searchParams.append(filter.queryParam, value)

    await goTo(page, expectedUrl.href)

    // Clear filter
    await page
      .locator('span', { hasText: value })
      .locator('..')
      .getByRole('button')
      .click()

    await page.waitForURL(BROWSE_DATASETS_URL)
    await validateTable({
      client,
      page,
    })
  })
}

export function testMultiInputFilter({
  label,
  filters,
  validateTable,
}: {
  filters: MultiInputFilter[]
  label: string
  validateTable: TableValidator
}) {
  test.describe(label, () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    filters.forEach((filter) =>
      testFilter({
        client,
        filter,
        validateTable,
        buttonLabel: label,
        hasMultipleFilters: filters.length > 1,
      }),
    )
  })
}
