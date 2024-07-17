import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { Page, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { identity } from 'lodash-es'

import { QueryParams } from 'app/constants/query'

import { TableValidator } from '../pageObjects/filters/types'
import { goTo } from './utils'

async function openDropdown(page: Page, label: string) {
  await page.getByRole('button', { name: label }).click()
}

async function selectOptions(page: Page, ...values: string[]) {
  for (const value of values) {
    await page.getByRole('option', { name: value }).locator('div').click()
  }

  await page.keyboard.press('Escape')
}

async function deselectOption(page: Page, value: string) {
  await page.click(`[role=button]:has-text("${value}") svg`)
}

export type SelectOptionsValidator = (
  page: Page,
  client: ApolloClient<NormalizedCacheObject>,
) => Promise<void>

export function testMultiSelectFilter({
  label,
  queryParam,
  serialize = identity,
  testOptions,
  testQuery,
  url,
  validateSelectOptions,
  validateTable,
}: {
  label: string
  queryParam: QueryParams
  serialize?(value: string): string
  testOptions: string[]
  testQuery?: string
  url: string
  validateSelectOptions?: SelectOptionsValidator
  validateTable: TableValidator
}) {
  test.describe(label, () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    testOptions.forEach((option) => {
      test(`should filter when selecting ${option}`, async ({ page }) => {
        const expectedUrl = new URL(url)
        const params = expectedUrl.searchParams
        params.append(queryParam, serialize(testOptions[0]))

        await goTo(page, url)
        await openDropdown(page, label)
        await selectOptions(page, testOptions[0])
        await page.waitForURL(expectedUrl.href)

        await validateTable({
          client,
          page,
          params,
        })
      })
    })

    test('should filter multiple values', async ({ page }) => {
      const expectedUrl = new URL(url)
      const params = expectedUrl.searchParams
      testOptions.forEach((option) =>
        params.append(queryParam, serialize(option)),
      )

      await goTo(page, expectedUrl.href)
      await validateTable({
        client,
        page,
        params,
      })
    })

    test('should clear filter', async ({ page }) => {
      const expectedUrl = new URL(url)
      const params = expectedUrl.searchParams
      params.append(queryParam, serialize(testOptions[0]))

      await goTo(page, expectedUrl.href)
      await deselectOption(page, testOptions[0])
      await page.waitForURL(url)

      await validateTable({
        client,
        page,
      })
    })

    if (validateSelectOptions && testQuery) {
      test('should filter values within filter dropdown', async ({ page }) => {
        await goTo(page, url)
        await openDropdown(page, label)

        const searchInput = page.getByRole('combobox', { name: 'Search' })
        await searchInput.click()
        await searchInput.fill(testQuery)

        await validateSelectOptions(page, client)
      })
    }
  })
}
