import apollo from '@apollo/client'
import { Page, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { BROWSE_DATASETS_URL, E2E_CONFIG } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { getDatasetTableFilterValidator, goTo, validateTable } from './utils'

async function openDatasetIds(page: Page) {
  await page.getByRole('button', { name: 'Dataset IDs' }).click()
}

async function fillDatasetIdInput(page: Page, label: string, value: string) {
  const pageLabel = `${label}:`
  await page.getByLabel(pageLabel).click()
  await page.getByLabel(pageLabel).fill(value)
}

async function applyDatasetIdFilter(page: Page) {
  await page.getByRole('button', { name: 'Apply' }).click()
}

async function clearDatasetIdFilter(page: Page, label: string, value: string) {
  await page
    .locator('div')
    .filter({ hasText: new RegExp(`^Dataset IDs${label}:${value}$`) })
    .getByRole('button')
    .nth(1)
    .click()
}

function testFilter({
  client,
  queryParam,
  label,
  valueKey,
}: {
  client: apollo.ApolloClient<apollo.NormalizedCacheObject>
  queryParam: QueryParams
  label: string
  valueKey: keyof typeof E2E_CONFIG
}) {
  const value = E2E_CONFIG[valueKey]

  test(`should filter by ${label}`, async ({ page }) => {
    const expectedUrl = new URL(BROWSE_DATASETS_URL)
    const params = expectedUrl.searchParams
    params.append(queryParam, value)
    const fetchExpectedData = getBrowseDatasets({ client, params })

    await goTo(page, BROWSE_DATASETS_URL)
    await openDatasetIds(page)
    await fillDatasetIdInput(page, label, value)
    await applyDatasetIdFilter(page)
    await page.waitForURL(expectedUrl.href)

    const { data } = await fetchExpectedData
    await validateTable({
      page,
      browseDatasetsData: data,
      validateRows: getDatasetTableFilterValidator(data),
    })
  })

  test(`should filter by ${label} when opening URL`, async ({ page }) => {
    const expectedUrl = new URL(BROWSE_DATASETS_URL)
    const params = expectedUrl.searchParams
    params.append(queryParam, value)

    const fetchExpectedData = getBrowseDatasets({ client, params })

    await goTo(page, expectedUrl.href)

    const { data } = await fetchExpectedData
    await validateTable({
      page,
      browseDatasetsData: data,
      validateRows: getDatasetTableFilterValidator(data),
    })
  })

  test(`should clear ${label} filter`, async ({ page }) => {
    const fetchExpectedData = getBrowseDatasets({ client })

    const expectedUrl = new URL(BROWSE_DATASETS_URL)
    expectedUrl.searchParams.append(queryParam, value)

    await goTo(page, expectedUrl.href)
    await clearDatasetIdFilter(page, label, value)
    await page.waitForURL(BROWSE_DATASETS_URL)

    const { data } = await fetchExpectedData
    await validateTable({
      page,
      browseDatasetsData: data,
      validateRows: getDatasetTableFilterValidator(data),
    })
  })
}

export function testDatasetIdsFilter() {
  test.describe('Dataset IDs', () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    testFilter({
      client,
      queryParam: QueryParams.PortalId,
      label: 'Portal ID',
      valueKey: 'datasetId',
    })

    testFilter({
      client,
      queryParam: QueryParams.EmpiarId,
      label: 'Empiar ID',
      valueKey: 'empiarId',
    })

    testFilter({
      client,
      queryParam: QueryParams.EmdbId,
      label: 'EMDB',
      valueKey: 'emdbId',
    })
  })
}
