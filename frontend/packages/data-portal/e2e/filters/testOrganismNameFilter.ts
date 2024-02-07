import apollo from '@apollo/client'
import { expect, Page, test } from '@playwright/test'
import { BROWSE_DATASETS_URL, E2E_CONFIG } from 'e2e/constants'
import { isString } from 'lodash-es'

import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { getDatasetTableFilterValidator, validateTable } from './utils'

async function openOrganismNameFilter(page: Page) {
  await page.getByRole('button', { name: 'Organism Name' }).click()
}

async function selectOrganismNames(page: Page, ...values: string[]) {
  for (const value of values) {
    await page.getByRole('option', { name: value }).locator('div').click()
  }

  await page.keyboard.press('Escape')
}

async function deselectNumberOfRuns(page: Page, value: string) {
  await page.click(`[role=button]:has-text("${value}") svg`)
}

export function testOrganismNameFilter(
  client: apollo.ApolloClient<apollo.NormalizedCacheObject>,
) {
  test.describe('Organism Name', () => {
    test('should filter by organism name', async ({ page }) => {
      const url = new URL(BROWSE_DATASETS_URL)
      const params = url.searchParams
      params.append(QueryParams.Organism, E2E_CONFIG.organismName1)
      const fetchData = getBrowseDatasets({
        client,
        params,
      })

      await page.goto(BROWSE_DATASETS_URL)
      await openOrganismNameFilter(page)
      await selectOrganismNames(page, E2E_CONFIG.organismName1)
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
      const params = url.searchParams
      params.append(QueryParams.Organism, E2E_CONFIG.organismName1)

      const fetchData = getBrowseDatasets({
        client,
        params,
      })

      await page.goto(url.href)

      const { data } = await fetchData
      await validateTable({
        page,
        browseDatasetsData: data,
        validateRows: getDatasetTableFilterValidator(data),
      })
    })

    test('should filter multiple values', async ({ page }) => {
      const url = new URL(BROWSE_DATASETS_URL)
      const params = url.searchParams
      params.append(QueryParams.Organism, E2E_CONFIG.organismName1)
      params.append(QueryParams.Organism, E2E_CONFIG.organismName2)

      const fetchData = getBrowseDatasets({
        client,
        params,
      })

      await page.goto(url.href)

      const { data } = await fetchData
      await validateTable({
        page,
        browseDatasetsData: data,
        validateRows: getDatasetTableFilterValidator(data),
      })
    })

    test('should filter values within filter dropdown', async ({ page }) => {
      const fetchData = getBrowseDatasets({ client })

      await page.goto(BROWSE_DATASETS_URL)
      await openOrganismNameFilter(page)

      const searchInput = page.getByRole('combobox', { name: 'Search' })
      await searchInput.click()
      await searchInput.fill(E2E_CONFIG.organismNameQuery)

      const { data } = await fetchData
      const organismNames = data.organism_names
        .map((name) => name.organism_name)
        .filter(isString)

      const filteredOrganismNames = organismNames.filter((name) =>
        name.toLowerCase().includes(E2E_CONFIG.organismNameQuery),
      )

      await Promise.all(
        filteredOrganismNames.map((name) =>
          expect(
            page.getByRole('option', { name }).locator('div'),
          ).toBeVisible(),
        ),
      )
    })

    test('should clear filter', async ({ page }) => {
      const fetchData = getBrowseDatasets({ client })

      const url = new URL(BROWSE_DATASETS_URL)
      const params = url.searchParams
      params.append(QueryParams.Organism, E2E_CONFIG.organismName1)

      await page.goto(url.href)
      await deselectNumberOfRuns(page, E2E_CONFIG.organismName1)
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
