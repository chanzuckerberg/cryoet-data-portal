import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { expect, Page, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { E2E_CONFIG } from 'e2e/constants'
import { TableValidator } from 'e2e/filters/types'
import { goTo } from 'e2e/filters/utils'

import { TestIds } from 'app/constants/testIds'

function getPagination(page: Page) {
  return page.getByTestId(TestIds.Pagination)
}

export function testPagination({
  filterParams,
  getMaxPages,
  rowLoadedSelector,
  url,
  validateTable,
}: {
  filterParams: URLSearchParams
  getMaxPages(
    client: ApolloClient<NormalizedCacheObject>,
    filterParams?: URLSearchParams,
    pageNumber?: number,
  ): Promise<number>
  rowLoadedSelector: string
  url: string
  validateTable: TableValidator
}) {
  test.describe(url.replace(E2E_CONFIG.url, ''), () => {
    let client = getApolloClient()

    test.beforeEach(() => {
      client = getApolloClient()
    })

    test('should show correct max page count', async ({ page }) => {
      await goTo(page, url)

      const node = getPagination(page)
      const maxPages = await getMaxPages(client)
      const pageNodes = node.locator('li')

      const count = await pageNodes.count()
      await expect(pageNodes.nth(count - 2)).toContainText(`${maxPages}`)
    })

    test('should show correct max page count when filtered', async ({
      page,
    }) => {
      const nextUrl = new URL(url)
      nextUrl.search = filterParams.toString()
      await goTo(page, nextUrl.href)

      const node = getPagination(page)
      const maxPages = await getMaxPages(client, filterParams)
      const pageNodes = node.locator('li')

      const count = await pageNodes.count()
      await expect(pageNodes.nth(count - 2)).toContainText(`${maxPages}`)
    })

    test('should load correct items when selecting a page', async ({
      page,
    }) => {
      await goTo(page, url)

      const node = getPagination(page)
      const pageNodes = node.locator('li')

      await pageNodes.nth(2).click()
      await page.waitForSelector(rowLoadedSelector)

      await validateTable({
        client,
        page,
        pageNumber: 2,
      })
    })

    test('should load correct items when selecting a page and is filtered', async ({
      page,
    }) => {
      const nextUrl = new URL(url)
      nextUrl.search = filterParams.toString()
      await goTo(page, nextUrl.href)

      const node = getPagination(page)
      const pageNodes = node.locator('li')

      await pageNodes.nth(2).click()
      await page.waitForSelector(rowLoadedSelector)

      await validateTable({
        client,
        page,
        pageNumber: 2,
        params: filterParams,
      })
    })
  })
}
