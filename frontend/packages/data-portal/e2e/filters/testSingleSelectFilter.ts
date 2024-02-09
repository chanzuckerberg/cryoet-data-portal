import { Page, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { BROWSE_DATASETS_URL } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { getDatasetTableFilterValidator, validateTable } from './utils'

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
  label,
  queryParam,
  serialize = (value) => value,
  values,
}: {
  label: string
  queryParam: QueryParams
  serialize?(value: string): string
  values: string[]
}) {
  test.describe(label, () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    values.forEach((value) =>
      test(`should filter when selecting ${value}`, async ({ page }) => {
        const expectedUrl = new URL(BROWSE_DATASETS_URL)
        const params = expectedUrl.searchParams
        params.set(queryParam, serialize(value) ?? value)

        const fetchExpectedData = getBrowseDatasets({
          client,
          params,
        })

        await page.goto(BROWSE_DATASETS_URL)

        await openFilterDropdown(page, label)
        await selectFilterOption(page, value)
        await page.waitForURL(expectedUrl.href)

        const { data } = await fetchExpectedData
        await validateTable({
          page,
          browseDatasetsData: data,
          validateRows: getDatasetTableFilterValidator(data),
        })
      }),
    )

    test('should filter when opening URL', async ({ page }) => {
      const expectedUrl = new URL(BROWSE_DATASETS_URL)
      const params = expectedUrl.searchParams
      params.append(queryParam, serialize(values[0]))

      const fetchExpectedData = getBrowseDatasets({
        client,
        params,
      })

      await page.goto(expectedUrl.href)

      const { data } = await fetchExpectedData
      await validateTable({
        page,
        browseDatasetsData: data,
        validateRows: getDatasetTableFilterValidator(data),
      })
    })

    test('should disable filter when deselecting', async ({ page }) => {
      const fetchExpectedData = getBrowseDatasets({
        client,
      })

      const expectedUrl = new URL(BROWSE_DATASETS_URL)
      expectedUrl.searchParams.append(queryParam, serialize(values[0]))

      await page.goto(expectedUrl.href)
      await removeFilterOption(page, values[0])
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
