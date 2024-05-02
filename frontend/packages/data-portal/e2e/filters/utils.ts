import { expect, Page, test } from '@playwright/test'

import {
  GetDatasetByIdQuery,
  GetDatasetsDataQuery,
} from 'app/__generated__/graphql'

async function waitForTableCountChange({
  countLabel,
  expectedFilterCount,
  expectedTotalCount,
  page,
}: {
  countLabel: string
  expectedFilterCount: number
  expectedTotalCount: number
  page: Page
}) {
  await page
    .getByText(
      new RegExp(
        `^${expectedFilterCount} of ${expectedTotalCount} ${countLabel}$`,
      ),
    )
    .waitFor()
}

/**
 * Validator for testing filters on the dataset table. This works by checking if
 * each row in the table has an existing dataset within the provided data. No
 * additional data is tested in this function to keep tests fast and focused on
 * testing the functionality of the filter.
 */
export function getDatasetTableFilterValidator(
  expectedData: GetDatasetsDataQuery,
) {
  const datasetIdSet = new Set(
    expectedData.datasets.map((dataset) => dataset.id),
  )

  return async (page: Page) => {
    const datasetIds = await Promise.all(
      (await page.getByText(/Dataset ID: [0-9]+/).all()).map(async (node) => {
        const text = await node.innerText()
        return text.replace('Dataset ID: ', '')
      }),
    )

    datasetIds.forEach((id) =>
      expect(
        datasetIdSet.has(+id),
        `Check if dataset ${id} is found within available set: ${Array.from(
          datasetIdSet,
        ).join(', ')}`,
      ).toBe(true),
    )
  }
}

export function getRunTableFilterValidator(expectedData: GetDatasetByIdQuery) {
  const runIds = new Set(expectedData.datasets.at(0)?.runs.map((run) => run.id))

  return async (page: Page) => {
    const datasetIds = await Promise.all(
      (await page.getByText(/Run ID: [0-9]+/).all()).map(async (node) => {
        const text = await node.innerText()
        return text.replace('Run ID: ', '')
      }),
    )

    datasetIds.forEach((id) =>
      expect(
        runIds.has(+id),
        `Check if run ${id} is found within available set: ${Array.from(
          runIds,
        ).join(', ')}`,
      ).toBe(true),
    )
  }
}

export async function validateTable({
  browseDatasetsData,
  countLabel = 'Datasets',
  page,
  singleDatasetData,
  validateRows,
}: {
  browseDatasetsData?: GetDatasetsDataQuery
  countLabel?: string
  page: Page
  singleDatasetData?: GetDatasetByIdQuery
  validateRows(page: Page): Promise<void>
}) {
  const expectedFilterCount =
    browseDatasetsData?.filtered_datasets_aggregate.aggregate?.count ??
    singleDatasetData?.datasets.at(0)?.filtered_runs_count.aggregate?.count ??
    0

  const expectedTotalCount =
    browseDatasetsData?.datasets_aggregate.aggregate?.count ??
    singleDatasetData?.datasets.at(0)?.runs_aggregate.aggregate?.count ??
    0

  await waitForTableCountChange({
    countLabel,
    expectedFilterCount,
    expectedTotalCount,
    page,
  })
  await validateRows(page)
}

/**
 * When loading the page, we need to wait a bit after so that the SDS components
 * have time to become interactive. Without the timeout, the tests become more
 * flaky and occasionally fail. For example, the filter dropdowns sometimes
 * don't open when clicked on because the playwright browser starts clicking on
 * it too fast while the JavaScript is still loading and hydrating.
 */
const TIME_UNTIL_INTERACTIVE = 3000

export async function goTo(page: Page, url: string) {
  await page.goto(url)

  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(TIME_UNTIL_INTERACTIVE)
}

export function skipClipboardTestsForWebkit(browserName: string) {
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip(
    browserName === 'webkit',
    'Skipping for safari because clipboard permissions are not availabe.',
  )
}
