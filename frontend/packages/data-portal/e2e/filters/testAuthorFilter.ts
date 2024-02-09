import apollo from '@apollo/client'
import { Page, test } from '@playwright/test'
import { BROWSE_DATASETS_URL, E2E_CONFIG } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { getDatasetTableFilterValidator, validateTable } from './utils'

async function openAuthorFilter(page: Page) {
  await page.getByRole('button', { name: 'Author' }).click()
}

async function fillAuthorFilterInput(page: Page, label: string, value: string) {
  const inputLabel = `${label}:`
  await page.getByLabel(inputLabel).click()
  await page.getByLabel(inputLabel).fill(value)
}

async function applyAuthorFilter(page: Page) {
  await page.getByRole('button', { name: 'Apply' }).click()
}

async function clearAuthorFilter(page: Page, label: string, value: string) {
  await page
    .locator('div')
    .filter({ hasText: new RegExp(`^Author${label}:${value}$`) })
    .getByRole('button')
    .nth(1)
    .click()
}

function testFilter({
  client,
  label,
  queryParam,
  valueKey,
}: {
  client: apollo.ApolloClient<apollo.NormalizedCacheObject>
  label: string
  queryParam: QueryParams
  valueKey: keyof typeof E2E_CONFIG
}) {
  const value = E2E_CONFIG[valueKey]

  test(`should filter by ${label}`, async ({ page }) => {
    const expectedUrl = new URL(BROWSE_DATASETS_URL)
    const params = expectedUrl.searchParams
    params.append(queryParam, value)
    const fetchExpectedData = getBrowseDatasets({ client, params })

    await page.goto(BROWSE_DATASETS_URL)
    await openAuthorFilter(page)
    await fillAuthorFilterInput(page, label, value)
    await applyAuthorFilter(page)
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

    await page.goto(expectedUrl.href)

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
    const params = expectedUrl.searchParams
    params.append(queryParam, value)

    await page.goto(expectedUrl.href)
    await clearAuthorFilter(page, label, value)
    await page.waitForURL(BROWSE_DATASETS_URL)

    const { data } = await fetchExpectedData
    await validateTable({
      page,
      browseDatasetsData: data,
      validateRows: getDatasetTableFilterValidator(data),
    })
  })
}

export function testAuthorFilter(
  client: apollo.ApolloClient<apollo.NormalizedCacheObject>,
) {
  test.describe('Author', () => {
    testFilter({
      client,
      queryParam: QueryParams.AuthorName,
      label: 'Author Name',
      valueKey: 'authorName',
    })

    testFilter({
      client,
      queryParam: QueryParams.AuthorOrcid,
      label: 'Author ORCID',
      valueKey: 'authorOrcId',
    })
  })
}
