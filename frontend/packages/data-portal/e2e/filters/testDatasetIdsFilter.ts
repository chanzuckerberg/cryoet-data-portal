/* eslint-disable no-await-in-loop */

import apollo from '@apollo/client'
import { Page, test } from '@playwright/test'
import { BROWSE_DATASETS_URL, E2E_CONFIG } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { getDatasetTableFilterValidator, validateTable } from './utils'

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
    const url = new URL(BROWSE_DATASETS_URL)
    const params = url.searchParams
    params.append(queryParam, value)
    const fetchData = getBrowseDatasets({ client, params })

    await page.goto(BROWSE_DATASETS_URL)
    await openDatasetIds(page)
    await fillDatasetIdInput(page, label, value)
    await applyDatasetIdFilter(page)
    await page.waitForURL(url.href)

    const { data } = await fetchData
    await validateTable({
      page,
      browseDatasetsData: data,
      validateRows: getDatasetTableFilterValidator(data),
    })
  })

  test(`should filter by ${label} when opening URL`, async ({ page }) => {
    const url = new URL(BROWSE_DATASETS_URL)
    const params = url.searchParams
    params.append(queryParam, value)

    const fetchData = getBrowseDatasets({ client, params })

    await page.goto(url.href)

    const { data } = await fetchData
    await validateTable({
      page,
      browseDatasetsData: data,
      validateRows: getDatasetTableFilterValidator(data),
    })
  })

  test(`should clear ${label} filter`, async ({ page }) => {
    const fetchData = getBrowseDatasets({ client })

    const url = new URL(BROWSE_DATASETS_URL)
    url.searchParams.append(queryParam, value)

    await page.goto(url.href)
    await clearDatasetIdFilter(page, label, value)
    await page.waitForURL(BROWSE_DATASETS_URL)

    const { data } = await fetchData
    await validateTable({
      page,
      browseDatasetsData: data,
      validateRows: getDatasetTableFilterValidator(data),
    })
  })
}

export function testDatasetIdsFilter(
  client: apollo.ApolloClient<apollo.NormalizedCacheObject>,
) {
  test.describe('Dataset IDs', () => {
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
      valueKey: 'empairId',
    })

    testFilter({
      client,
      queryParam: QueryParams.EmdbId,
      label: 'EMDB',
      valueKey: 'emdbId',
    })
  })
}
