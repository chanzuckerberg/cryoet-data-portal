import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { E2E_CONFIG } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'

import { TableValidator } from '../pageObjects/filters/types'
import { goTo } from './utils'

export interface MultiInputFilter {
  label: string
  queryParam: QueryParams
  valueKey: keyof typeof E2E_CONFIG
}

interface SharedOptions {
  url: string
  validateTable: TableValidator
}

function testFilter({
  buttonLabel,
  client,
  filter,
  hasMultipleFilters,
  url,
  validateTable,
}: SharedOptions & {
  buttonLabel: string
  client: ApolloClient<NormalizedCacheObject>
  filter: MultiInputFilter
  hasMultipleFilters: boolean
}) {
  const value = E2E_CONFIG[filter.valueKey] as string

  test(`should filter by ${filter.label}`, async ({ page }) => {
    const expectedUrl = new URL(url)
    const params = expectedUrl.searchParams
    params.append(filter.queryParam, value)

    await goTo(page, url)

    // Open multi input filter
    await page.getByRole('button', { name: buttonLabel }).click()

    // Fill input
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
    const expectedUrl = new URL(url)
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
    const expectedUrl = new URL(url)
    expectedUrl.searchParams.append(filter.queryParam, value)

    await goTo(page, expectedUrl.href)

    // Clear filter
    await page
      .locator('span', { hasText: value })
      .locator('..')
      .getByRole('button')
      .click()

    await page.waitForURL(url)
    await validateTable({
      client,
      page,
    })
  })
}

export function testMultiInputFilter({
  filters,
  label,
  url,
  validateTable,
}: SharedOptions & {
  filters: MultiInputFilter[]
  label: string
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
        url,
        validateTable,
        buttonLabel: label,
        hasMultipleFilters: filters.length > 1,
      }),
    )
  })
}
