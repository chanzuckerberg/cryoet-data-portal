/* eslint-disable import/no-extraneous-dependencies */

import { expect, Page } from '@playwright/test'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'

const TABLE_COUNT_REGEX = /^([0-9]+) of ([0-9]+) Datasets$/

async function waitForTableCountChange(
  page: Page,
  expectedFilterCount: number,
) {
  await page
    .getByText(new RegExp(`^${expectedFilterCount} of [0-9]+ Datasets$`))
    .waitFor()
}

/**
 * Validator for testing filters on the dataset table. This works by checking if
 * each row in the table has an existing dataset within the provided data. No
 * additional data is tested in this function to keep tests fast and focused on
 * testing the functionality of the filter.
 */
export function getDatasetTableFilterValidator(data: GetDatasetsDataQuery) {
  const datasetIdSet = new Set(data.datasets.map((dataset) => dataset.id))

  return async (page: Page) => {
    const datasetIds = await Promise.all(
      (await page.getByText(/Portal ID: [0-9]+/).all()).map(async (node) => {
        const text = await node.innerText()
        return text.replace('Portal ID: ', '')
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

export async function validateTable({
  browseDatasetsData,
  page,
  validateRows,
}: {
  browseDatasetsData?: GetDatasetsDataQuery
  page: Page
  validateRows(page: Page): Promise<void>
}) {
  const filterCount =
    browseDatasetsData?.filtered_datasets_aggregate.aggregate?.count ?? 0

  const totalCount =
    browseDatasetsData?.datasets_aggregate.aggregate?.count ?? 0

  await waitForTableCountChange(page, filterCount)

  const tableCountText = await page.getByText(TABLE_COUNT_REGEX).textContent()

  const match = TABLE_COUNT_REGEX.exec(tableCountText ?? '')

  const actualFilterCount = +(match?.at(1) ?? '0')
  const actualTotalCount = +(match?.at(2) ?? '0')

  expect(actualFilterCount, 'Check filtered count').toBe(filterCount)
  expect(actualTotalCount, 'Check total count').toBe(totalCount)

  await validateRows(page)
}
