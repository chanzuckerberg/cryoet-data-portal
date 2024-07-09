/* eslint-disable playwright/no-conditional-in-test */
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { expect, Page, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { E2E_CONFIG, translations } from 'e2e/constants'
import { goTo } from 'e2e/filters/utils'
import { isArray } from 'lodash-es'

import { TestIds } from 'app/constants/testIds'

import { MetadataDrawerPage } from './metadata-drawer-page'
import { DrawerTestData } from './types'

function getMetadataDrawer(page: Page) {
  return page.getByTestId(TestIds.MetadataDrawer)
}

function getCloseButton(page: Page) {
  return page.getByTestId(TestIds.MetadataDrawerCloseButton)
}

export function testMetadataDrawer({
  getTestData,
  openDrawer,
  title,
  url,
}: {
  getTestData(
    client: ApolloClient<NormalizedCacheObject>,
  ): Promise<DrawerTestData>
  openDrawer(page: Page): Promise<void>
  title?: string
  url: string
}) {
  test.describe(
    url.replace(E2E_CONFIG.url, '') + (title ? ` - ${title}` : ''),
    () => {
      let client = getApolloClient()

      test.beforeEach(() => {
        client = getApolloClient()
      })

      test('should open metadata drawer', async ({ page }) => {
        const metadataDrawerPage = new MetadataDrawerPage(page)
        await metadataDrawerPage.goTo(page, url)

        const drawer = metadataDrawerPage.getMetadataDrawer()
        await expect(drawer).toBeHidden()
        await openDrawer(page)
        await expect(drawer).toBeVisible()
      })

      test('should close metadata drawer on click x', async ({ page }) => {
        await goTo(page, url)

        await openDrawer(page)
        const drawer = getMetadataDrawer(page)
        await drawer.waitFor({ state: 'visible' })

        await getCloseButton(page).click()
        await expect(drawer).toBeHidden()
      })

      test('metadata should have correct data', async ({ page }) => {
        await goTo(page, url)

        await openDrawer(page)
        const drawer = getMetadataDrawer(page)
        await drawer.waitFor({ state: 'visible' })

        const data = await getTestData(client)
        await expect(drawer).toContainText(data.title)

        const unexpanded = await drawer
          .getByRole('button', { expanded: false })
          .count()

        // We expand the accordions one by one because clicking on all of them
        // programatically will break playwright. Assume the Playwright locator
        // finds two accordions and stores their locator nodes in 0 and 1. If we
        // click on 0, the node is changed to have the attribute expanded=true,
        // resulting in the locator updating and changing the node in 1 to 0.
        //
        // To get around this, we get a count of unexpanded accordions and click
        // on the first accordion we find in the drawer.
        for (let i = 0; i < unexpanded; i += 1) {
          await drawer.getByRole('button', { expanded: false }).first().click()
        }

        for (const [key, value] of Object.entries(data.metadata)) {
          const label = translations[key as keyof typeof translations]
          const cells = drawer.locator(`tr:has-text("${label}") td`)

          // Array:
          if (isArray(value)) {
            const nodeValue = await cells.last().innerText()
            expect(
              value.every((v) => nodeValue.includes(v ?? '')),
              `Test for ${label} with value ${nodeValue} to include ${value.join(
                ', ',
              )}`,
            ).toBe(true)
            continue
          }
          // String or number:
          if (value !== null) {
            await expect(
              cells.last(),
              `Test for ${label} to have value ${value}`,
            ).toContainText(`${value}`)
            continue
          }
          // Empty because N/A:
          if (
            data.metadata.groundTruthStatus &&
            ['groundTruthUsed', 'precision', 'recall'].includes(key)
          ) {
            await expect(
              cells.last(),
              `Test for ${label} to be "Not Applicable"`,
            ).toContainText('Not Applicable')
            continue
          }
          // Empty:
          await expect(
            cells.last(),
            `Test for ${label} to be empty`,
          ).toContainText('--')
        }
      })
    },
  )
}
