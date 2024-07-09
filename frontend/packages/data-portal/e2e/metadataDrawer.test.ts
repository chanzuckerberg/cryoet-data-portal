import { test } from '@playwright/test'

import { getApolloClient } from './apollo'
import { E2E_CONFIG, SINGLE_DATASET_URL, SINGLE_RUN_URL } from './constants'
import { MetadataDrawerPage } from './metadataDrawer/metadata-drawer-page'

test.describe('Metadata Drawer', () => {
  test.describe(`Single Dataset: ${SINGLE_DATASET_URL.replace(
    E2E_CONFIG.url,
    '',
  )}`, () => {
    let client = getApolloClient()
    test.beforeEach(() => {
      client = getApolloClient()
    })

    test('should open metadata drawer', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(SINGLE_DATASET_URL)

      await metadataDrawerPage.expectMetadataDrawerToBeHidden()
      await metadataDrawerPage.openViewAllInfoDrawer()
      await metadataDrawerPage.expectMetadataDrawerToBeVisible()
    })

    test('should close metadata drawer on click x', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(SINGLE_DATASET_URL)

      await metadataDrawerPage.openViewAllInfoDrawer()
      await metadataDrawerPage.waitForMetadataDrawerToBeVisible()

      await metadataDrawerPage.closeMetadataDrawer()
      await metadataDrawerPage.expectMetadataDrawerToBeHidden()
    })

    test('metadata should have correct data', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(SINGLE_DATASET_URL)
      await metadataDrawerPage.openViewAllInfoDrawer()
      await metadataDrawerPage.waitForMetadataDrawerToBeVisible()

      const data = await metadataDrawerPage.getSingleDatasetTestMetadata(client)
      await metadataDrawerPage.expectMetadataDrawerToShowTitle(data.title)
      await metadataDrawerPage.expandAllAccordions()
      await metadataDrawerPage.expectMetadataTableCellsToDisplayValues(data)
    })
  })

  test.describe(`Single Run: ${SINGLE_RUN_URL.replace(
    E2E_CONFIG.url,
    '',
  )}`, () => {
    let client = getApolloClient()
    test.beforeEach(() => {
      client = getApolloClient()
    })
    test('should open metadata drawer', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(SINGLE_RUN_URL)

      await metadataDrawerPage.expectMetadataDrawerToBeHidden()
      await metadataDrawerPage.openViewAllInfoDrawer()
      await metadataDrawerPage.expectMetadataDrawerToBeVisible()
    })

    test('should close metadata drawer on click x', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(SINGLE_RUN_URL)

      await metadataDrawerPage.openViewAllInfoDrawer()
      await metadataDrawerPage.waitForMetadataDrawerToBeVisible()

      await metadataDrawerPage.closeMetadataDrawer()
      await metadataDrawerPage.expectMetadataDrawerToBeHidden()
    })

    test('metadata should have correct data', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(SINGLE_RUN_URL)
      await metadataDrawerPage.openViewAllInfoDrawer()
      await metadataDrawerPage.waitForMetadataDrawerToBeVisible()

      const data = await metadataDrawerPage.getSingleRunTestMetadata(client)
      await metadataDrawerPage.expectMetadataDrawerToShowTitle(data.title)
      await metadataDrawerPage.expandAllAccordions()
      await metadataDrawerPage.expectMetadataTableCellsToDisplayValues(data)
    })
  })

  test.describe(`Annotation Metadata: ${SINGLE_RUN_URL.replace(
    E2E_CONFIG.url,
    '',
  )}`, () => {
    let client = getApolloClient()
    test.beforeEach(() => {
      client = getApolloClient()
    })
    test('should open metadata drawer', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(SINGLE_RUN_URL)

      await metadataDrawerPage.expectMetadataDrawerToBeHidden()
      await metadataDrawerPage.openInfoDrawer()
      await metadataDrawerPage.expectMetadataDrawerToBeVisible()
    })

    test('should close metadata drawer on click x', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(SINGLE_RUN_URL)

      await metadataDrawerPage.openInfoDrawer()
      await metadataDrawerPage.waitForMetadataDrawerToBeVisible()

      await metadataDrawerPage.closeMetadataDrawer()
      await metadataDrawerPage.expectMetadataDrawerToBeHidden()
    })

    test('metadata should have correct data', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(SINGLE_RUN_URL)
      await metadataDrawerPage.openInfoDrawer()
      await metadataDrawerPage.waitForMetadataDrawerToBeVisible()

      const data = await metadataDrawerPage.getAnnotationTestMetadata(client)
      await metadataDrawerPage.expectMetadataDrawerToShowTitle(data.title)
      await metadataDrawerPage.expandAllAccordions()
      await metadataDrawerPage.expectMetadataTableCellsToDisplayValues(data)
    })
  })
})
