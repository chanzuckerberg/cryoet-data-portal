import { expect, Page } from '@playwright/test'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'

async function waitForTableCountChange(
  page: Page,
  expectedFilterCount: number,
  expectedTotalCount: number,
) {
  await page
    .getByText(
      new RegExp(`^${expectedFilterCount} of ${expectedTotalCount} Datasets$`),
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
  const expectedFilterCount =
    browseDatasetsData?.filtered_datasets_aggregate.aggregate?.count ?? 0

  const expectedTotalCount =
    browseDatasetsData?.datasets_aggregate.aggregate?.count ?? 0

  await waitForTableCountChange(page, expectedFilterCount, expectedTotalCount)
  await validateRows(page)
}
