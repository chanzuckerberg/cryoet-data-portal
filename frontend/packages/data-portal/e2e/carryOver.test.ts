import { expect, test } from '@chromatic-com/playwright'

import { QueryParams } from 'app/constants/query'

import {
  BROWSE_DATASETS_URL,
  E2E_CONFIG,
  SINGLE_DATASET_URL,
  translations,
} from './constants'
import { BreadcrumbsPage } from './pageObjects/breadcrumbsPage'
import { FiltersActor } from './pageObjects/filters/filtersActor'
import { FiltersPage } from './pageObjects/filters/filtersPage'
import { TableActor } from './pageObjects/table/tableActor'
import { TablePage } from './pageObjects/table/tablePage'

let filtersPage: FiltersPage
let filtersActor: FiltersActor
let tablePage: TablePage
let tableActor: TableActor
let breadcrumbsPage: BreadcrumbsPage

test.beforeEach(({ page }) => {
  filtersPage = new FiltersPage(page)
  filtersActor = new FiltersActor(filtersPage)
  tablePage = new TablePage(page)
  tableActor = new TableActor(tablePage)
  breadcrumbsPage = new BreadcrumbsPage(page)
})

const TEST_PARAM = QueryParams.ObjectName
const TEST_VALUE = E2E_CONFIG.objectName

test.describe('Carry over filters', () => {
  test('should carry over datasets filter into single dataset page', async ({
    page,
  }) => {
    await page.goto(BROWSE_DATASETS_URL)
    await filtersActor.addSingleSelectFilter({
      label: translations.objectName,
      value: TEST_VALUE,
    })

    await tableActor.openFirstResult(TEST_PARAM, TEST_VALUE)
  })

  test('should carry over single dataset filter into single run page', async ({
    page,
  }) => {
    await page.goto(SINGLE_DATASET_URL)
    await filtersActor.addSingleSelectFilter({
      label: translations.objectName,
      value: TEST_VALUE,
    })

    await tableActor.openFirstResult(TEST_PARAM, TEST_VALUE)
  })
  test('should have filter in browse dataset breadcrumb url', async ({
    page,
  }) => {
    await page.goto(BROWSE_DATASETS_URL)
    await filtersActor.addSingleSelectFilter({
      label: translations.objectName,
      value: TEST_VALUE,
    })

    // Check links at single dataset level
    await tableActor.openFirstResult(TEST_PARAM, TEST_VALUE)

    await expect(
      breadcrumbsPage.getBreadcrumb({
        index: 0,
        param: TEST_PARAM,
        value: TEST_VALUE,
      }),
    ).toBeVisible()

    // Check links at single run level
    await tableActor.openFirstResult(TEST_PARAM, TEST_VALUE)
  })

  test('should have filter in single dataset breadcrumb url', async ({
    page,
  }) => {
    await page.goto(SINGLE_DATASET_URL)
    await filtersActor.addSingleSelectFilter({
      label: translations.objectName,
      value: TEST_VALUE,
    })

    await tableActor.openFirstResult(TEST_PARAM, TEST_VALUE)
  })

  // TODO When we have more data to test with
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip('should carry over single deposition filter into single dataset page', async () => {})

  // TODO When we have more data to test with
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip('should carry over single deposition filter into single run page', async () => {})

  // TODO When we have more data to test with
  // eslint-disable-next-line playwright/no-skipped-test
  test.skip('should remove deposition id filter when click on remove filter button', async () => {})
})
