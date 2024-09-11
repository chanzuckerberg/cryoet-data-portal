/*
 * NOTE: This file does not use the preferred page object pattern.
 * This is because we did not have time to refactor.
 * Please do not use this file as an example of how to write tests.
 */
import { expect, Page, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { E2E_CONFIG } from 'e2e/constants'
import { goTo } from 'e2e/filters/utils'
import { TableValidator } from 'e2e/pageObjects/filters/types'
import { isNumber } from 'lodash-es'

import { TestIds } from 'app/constants/testIds'

import {
  GetMaxPages,
  PaginationFilter,
  TestOptions as PaginationTestOptions,
} from './types'
import { getParamsFromFilter } from './utils'

function getPagination(page: Page) {
  return page.getByTestId(TestIds.Pagination)
}

function getPreviousButton(page: Page) {
  return page.getByLabel('Previous page')
}

function getNextButton(page: Page) {
  return page.getByLabel('Next page')
}

async function clickVisiblePageButton(page: Page, pageNumber: number) {
  await getPagination(page).getByText(`${pageNumber}`).click()
}

async function openPaginationDropdown(page: Page) {
  await page.getByLabel('Go to a page').click()
}

async function selectPaginationDropdownOption(page: Page, pageNumber: number) {
  await page.getByRole('menu').getByText(`${pageNumber}`).click()
}

async function waitForPageNumber(page: Page, pageNumber: number) {
  await page.waitForURL(
    (url) => url.searchParams.get('page') === `${pageNumber}`,
  )
}

const { pagination } = E2E_CONFIG

export function testPagination({
  getMaxPages,
  rowLoadedSelector,
  testFilter,
  testFilterWithNoPages,
  url,
  validateTable,
}: {
  getMaxPages: GetMaxPages
  rowLoadedSelector: string
  testFilter: PaginationFilter
  testFilterWithNoPages: PaginationFilter
  url: string
  validateTable: TableValidator
}) {
  test.describe(url.replace(E2E_CONFIG.url, ''), () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    async function openPage({
      filter,
      page,
      pageNumber,
    }: {
      filter?: PaginationFilter
      page: Page
      pageNumber?: number
    }) {
      const nextUrl = new URL(url)

      if (filter) {
        nextUrl.searchParams.set(filter.key, filter.value)
      }

      if (isNumber(pageNumber)) {
        nextUrl.searchParams.set('page', `${pageNumber}`)
      }

      await goTo(page, nextUrl.href)
    }

    function testMaxPageCount({ filter }: PaginationTestOptions = {}) {
      test(`should show correct max page count${
        filter ? ' when filtered' : ''
      }`, async ({ page }) => {
        await openPage({ page, filter })

        const maxPages = await getMaxPages(client, filter)
        await expect(getPagination(page)).toContainText(`${maxPages}`)
      })
    }

    function testSelectPage({ pageNumber = 1, filter }: PaginationTestOptions) {
      test(`should load correct items when selecting a page${
        filter ? ' and is filtered' : ''
      }`, async ({ page }) => {
        await openPage({ page, filter })

        await clickVisiblePageButton(page, pageNumber)
        await page.waitForSelector(rowLoadedSelector)

        await waitForPageNumber(page, pageNumber)
        await validateTable({
          client,
          page,
          pageNumber,
          params: getParamsFromFilter(filter),
        })
      })
    }

    function testSelectPageFromDropdown({
      filter,
      pageNumber = 1,
    }: PaginationTestOptions) {
      test(`should load correct items when selecting a page from dropdown${
        filter ? ' and is filtered' : ''
      }`, async ({ page }) => {
        await openPage({ page, filter })

        await openPaginationDropdown(page)
        await selectPaginationDropdownOption(page, pageNumber)
        await page.waitForSelector(rowLoadedSelector)

        await waitForPageNumber(page, pageNumber)
        await validateTable({
          client,
          page,
          pageNumber,
          params: getParamsFromFilter(filter),
        })
      })
    }

    testMaxPageCount()
    testMaxPageCount({ filter: testFilter })

    testSelectPage({ pageNumber: pagination.selectPage })
    testSelectPage({ pageNumber: pagination.selectPage, filter: testFilter })

    testSelectPageFromDropdown({
      pageNumber: pagination.selectPageFromDropdown,
    })
    testSelectPageFromDropdown({
      pageNumber: pagination.selectPageFromDropdown,
      filter: testFilter,
    })

    test('should load next page when clicking on next button', async ({
      page,
    }) => {
      await openPage({ page })
      await getNextButton(page).click()
      await page.waitForSelector(rowLoadedSelector)
      await waitForPageNumber(page, 2)
      await validateTable({
        client,
        page,
        pageNumber: 2,
      })
    })

    test('should load previous page when clicking on previous button', async ({
      page,
    }) => {
      await openPage({ page, pageNumber: 2 })
      await getPreviousButton(page).click()
      await page.waitForSelector(rowLoadedSelector)
      await waitForPageNumber(page, 1)
      await validateTable({
        client,
        page,
      })
    })

    test('should disable previous button when on first page', async ({
      page,
    }) => {
      await openPage({ page })
      await expect(getPreviousButton(page)).toBeDisabled()
    })

    test('should disable next button when on last page', async ({ page }) => {
      const maxPages = await getMaxPages(client)
      await openPage({ page, pageNumber: maxPages })
      await expect(getNextButton(page)).toBeDisabled()
    })

    test('should hide pagination when maxPages is 1', async ({ page }) => {
      await openPage({ page, filter: testFilterWithNoPages })
      await expect(getPagination(page)).toBeHidden()
    })
  })
}
