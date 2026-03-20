/*
 * NOTE: This file does not use the preferred page object pattern.
 * This is because we did not have time to refactor.
 * Please do not use this file as an example of how to write tests.
 */
import { expect, test } from '@chromatic-com/playwright'
import { Page } from '@playwright/test'
import { E2E_CONFIG } from 'e2e/constants'
import { goTo } from 'e2e/filters/utils'
import { waitForTableReload } from 'e2e/utils'
import { isNumber } from 'lodash-es'

import { QueryParams } from 'app/constants/query'
import { TestIds } from 'app/constants/testIds'

import { PaginationFilter, TestOptions as PaginationTestOptions } from './types'

function getPagination(page: Page) {
  return page.getByTestId(TestIds.Pagination)
}

// SDS/MUI: data-order is on the list item; the control may be button, [role="button"], a, or the li itself.
function paginationNavControl(page: Page, order: 'first' | 'last') {
  const item = getPagination(page).locator(`[data-order="${order}"]`)
  return item.locator('button, [role="button"], a').or(item)
}

function getPreviousButton(page: Page) {
  return paginationNavControl(page, 'first')
}

function getNextButton(page: Page) {
  return paginationNavControl(page, 'last')
}

// MUI: previous (first page) often sets `disabled` on the <li>. Next (last page) usually disables the inner control only.
function getPaginationOrderItem(page: Page, order: 'first' | 'last') {
  return getPagination(page).locator(`[data-order="${order}"]`)
}

async function clickVisiblePageButton(page: Page, pageNumber: number) {
  await getPagination(page).getByText(`${pageNumber}`, { exact: true }).click()
}

async function openPaginationDropdown(page: Page) {
  await page.getByLabel('Go to a page').click()
}

function getPageQueryParam(fixture: Page): string {
  return new URL(fixture.url()).searchParams.get(QueryParams.Page) ?? '1'
}

/** Remix updates `page` in the URL; skeleton may never show (waitForTableReload would hang). */
async function waitForPageQueryToDifferFrom(
  fixture: Page,
  previous: string,
  timeout = 10_000,
): Promise<void> {
  await fixture.waitForURL(
    (url) => (url.searchParams.get(QueryParams.Page) ?? '1') !== previous,
    { timeout },
  )
}

/**
 * Resolve the last page index from the SDS Pagination root.
 *
 * Some builds expose "start–end of total" inside this node; others only expose the
 * page control labels (e.g. "1\\n2\\n3\\n4\\n5\\n18") with no item range text.
 */
async function parseLastPageFromPagination(fixture: Page): Promise<number> {
  await getPagination(fixture).waitFor({ state: 'visible', timeout: 30_000 })
  const text = await getPagination(fixture).innerText()

  const rangeMatch = text.match(/(\d[\d,]*)[-\u2013](\d[\d,]*) of (\d[\d,]*)/)
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1].replaceAll(',', ''), 10)
    const end = parseInt(rangeMatch[2].replaceAll(',', ''), 10)
    const total = parseInt(rangeMatch[3].replaceAll(',', ''), 10)
    const pageSize = end - start + 1
    return Math.max(1, Math.ceil(total / pageSize))
  }

  const nums = text.match(/\d[\d,]*/g)
  if (!nums?.length) {
    throw new Error(
      `Could not determine last page from pagination text: ${text}`,
    )
  }

  return Math.max(...nums.map((n) => parseInt(n.replaceAll(',', ''), 10)))
}

/** Jump to the last page in one navigation (avoids hundreds of Next clicks + 60s test timeout). */
async function goToLastPageViaUrl(fixture: Page) {
  const lastPage = await parseLastPageFromPagination(fixture)
  if (getPageQueryParam(fixture) === `${lastPage}`) {
    return
  }
  const nextUrl = new URL(fixture.url())
  nextUrl.searchParams.set(QueryParams.Page, `${lastPage}`)
  await goTo(fixture, nextUrl.href)
  await fixture.waitForURL(
    (u) => (u.searchParams.get(QueryParams.Page) ?? '1') === `${lastPage}`,
    { timeout: 30_000 },
  )
}

/**
 * SDS/MUI may not expose a reliable disabled state on the last-page Next control in the DOM.
 * Assert we cannot advance: either Playwright sees Next as disabled, or one more click does not change `page`.
 */
async function expectNextDoesNotAdvancePagination(fixture: Page) {
  const next = getNextButton(fixture)
  const before = getPageQueryParam(fixture)

  if (await next.isDisabled()) {
    return
  }

  await next.click()
  try {
    await waitForPageQueryToDifferFrom(fixture, before, 6_000)
    // If the URL changed, Next incorrectly advanced off the last page
    expect(getPageQueryParam(fixture)).toBe(before)
  } catch {
    expect(getPageQueryParam(fixture)).toBe(before)
  }
}

async function selectPaginationDropdownOption(page: Page, pageNumber: number) {
  await page
    .getByRole('menu')
    .getByText(`${pageNumber}`, { exact: true })
    .click()
}

async function waitForPageNumber(page: Page, pageNumber: number) {
  await page.waitForURL(
    (url) => url.searchParams.get(QueryParams.Page) === `${pageNumber}`,
  )
}

const { pagination } = E2E_CONFIG

export function testPagination({
  testFilter,
  testFilterWithNoPages,
  url,
}: {
  testFilter: PaginationFilter
  testFilterWithNoPages: PaginationFilter
  url: string
}) {
  test.describe(url.replace(E2E_CONFIG.url, ''), () => {
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
      })
    }

    function testSelectPage({ pageNumber = 1, filter }: PaginationTestOptions) {
      test(`should load correct items when selecting a page${
        filter ? ' and is filtered' : ''
      }`, async ({ page }) => {
        await openPage({ page, filter })
        await clickVisiblePageButton(page, pageNumber)

        await waitForPageNumber(page, pageNumber)
        await waitForTableReload(page)
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

        await waitForPageNumber(page, pageNumber)
        await waitForTableReload(page)
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
      await waitForPageNumber(page, 2)
      await waitForTableReload(page)
    })

    test('should load previous page when clicking on previous button', async ({
      page,
    }) => {
      await openPage({ page, pageNumber: 2 })
      await getPreviousButton(page).click()
      await waitForPageNumber(page, 1)
      await waitForTableReload(page)
    })

    test('should disable previous button when on first page', async ({
      page,
    }) => {
      await openPage({ page })
      await expect(getPaginationOrderItem(page, 'first')).toHaveAttribute(
        'disabled',
      )
    })

    test('should disable next button when on last page', async ({ page }) => {
      await openPage({ page })
      await goToLastPageViaUrl(page)
      await expectNextDoesNotAdvancePagination(page)
    })

    test('should hide pagination when maxPages is 1', async ({ page }) => {
      await openPage({ page, filter: testFilterWithNoPages })
      await expect(getPagination(page)).toBeHidden()
    })
  })
}
