import { Page, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { BROWSE_DATASETS_URL } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'

import { getDatasetTableFilterValidator, validateTable } from './utils'

async function clickAvailableFilesButton(page: Page) {
  await page.getByRole('button', { name: 'Available Files' }).click()
}

async function selectAvailableFilesOption(page: Page, label: string) {
  await page.click(`li:has-text("${label}")`)
  await page.keyboard.press('Escape')
}

async function clearAvailableFileOption(page: Page, labels: string[]) {
  await Promise.all(
    labels.map((label) => page.click(`[role=button]:has-text("${label}") svg`)),
  )
}

export function testAvailableFilesFilter() {
  test.describe('Available Files', () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    const filterOptions = [
      { value: 'raw-frames', label: 'Raw Frames' },
      { value: 'tilt-series', label: 'Tilt Series' },
      { value: 'tilt-series-alignment', label: 'Tilt Series Alignment' },
      { value: 'tomogram', label: 'Tomograms' },
    ]

    filterOptions.forEach((option) =>
      test(`should filter when selecting ${option.label}`, async ({ page }) => {
        const expectedUrl = new URL(BROWSE_DATASETS_URL)
        const params = expectedUrl.searchParams
        params.append(QueryParams.AvailableFiles, option.value)

        const fetchExpectedData = getBrowseDatasets({
          client,
          params,
        })

        await page.goto(BROWSE_DATASETS_URL)
        await clickAvailableFilesButton(page)
        await selectAvailableFilesOption(page, option.label)
        await page.waitForURL(expectedUrl.href)

        const { data } = await fetchExpectedData
        await validateTable({
          page,
          browseDatasetsData: data,
          validateRows: getDatasetTableFilterValidator(data),
        })
      }),
    )

    test('should filter when selecting multiple', async ({ page }) => {
      const expectedUrl = new URL(BROWSE_DATASETS_URL)
      await page.goto(expectedUrl.href)

      const params = expectedUrl.searchParams
      const files = [
        { value: 'raw-frames', label: 'Raw Frames' },
        { value: 'tilt-series-alignment', label: 'Tilt Series Alignment' },
      ]

      for (const { value, label } of files) {
        params.append(QueryParams.AvailableFiles, value)

        const fetchExpectedData = getBrowseDatasets({
          client,
          params,
        })

        await clickAvailableFilesButton(page)
        await selectAvailableFilesOption(page, label)
        await page.waitForURL(expectedUrl.href)

        const { data } = await fetchExpectedData
        await validateTable({
          page,
          browseDatasetsData: data,
          validateRows: getDatasetTableFilterValidator(data),
        })
      }
    })

    test('should filter when opening URL', async ({ page }) => {
      const expectedUrl = new URL(BROWSE_DATASETS_URL)
      const params = expectedUrl.searchParams
      params.append(QueryParams.AvailableFiles, 'raw-frames')
      params.append(QueryParams.AvailableFiles, 'tilt-series-alignment')

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
      expectedUrl.searchParams.append(QueryParams.AvailableFiles, 'raw-frames')
      expectedUrl.searchParams.append(
        QueryParams.AvailableFiles,
        'tilt-series-alignment',
      )

      await page.goto(expectedUrl.href)
      await clickAvailableFilesButton(page)
      await selectAvailableFilesOption(page, 'Raw Frames')
      await clearAvailableFileOption(page, ['Tilt Series Alignment'])
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
