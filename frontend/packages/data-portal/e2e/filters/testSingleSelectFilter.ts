import { Page, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { identity } from 'lodash-es'

import { QueryParams } from 'app/constants/query'

import { TableValidator } from './types'
import { goTo } from './utils'

async function openFilterDropdown(page: Page, label: string) {
  await page.getByRole('button', { name: label }).click()
}

async function selectFilterOption(page: Page, label: string) {
  await page
    .getByRole('option', { name: label })
    .locator('span')
    .first()
    .click()

  await page.keyboard.press('Escape')
}

async function removeFilterOption(page: Page, label: string) {
  await page.click(`[role=button]:has-text("${label}") svg`)
}

export function testSingleSelectFilter({
  url,
  validateTable,
  label,
  queryParam,
  serialize = identity,
  values,
}: {
  label: string
  queryParam: QueryParams
  serialize?(value: string): string
  url: string
  validateTable: TableValidator
  values: string[]
}) {
  test.describe(label, () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    values.forEach((value) =>
      test(`should filter when selecting ${value}`, async ({ page }) => {
        const expectedUrl = new URL(url)
        const params = expectedUrl.searchParams
        params.set(queryParam, serialize(value) ?? value)

        await goTo(page, url)
        await openFilterDropdown(page, label)
        await selectFilterOption(page, value)
        await page.waitForURL(expectedUrl.href)

        await validateTable({
          client,
          page,
          params,
        })
      }),
    )

    test('should filter when opening URL', async ({ page }) => {
      const expectedUrl = new URL(url)
      const params = expectedUrl.searchParams
      params.append(queryParam, serialize(values[0]))

      await goTo(page, expectedUrl.href)
      await validateTable({
        client,
        page,
        params,
      })
    })

    test('should disable filter when deselecting', async ({ page }) => {
      const expectedUrl = new URL(url)
      expectedUrl.searchParams.append(queryParam, serialize(values[0]))

      await goTo(page, expectedUrl.href)
      await removeFilterOption(page, values[0])
      await page.waitForURL(url)
      await validateTable({
        client,
        page,
      })
    })
  })
}
