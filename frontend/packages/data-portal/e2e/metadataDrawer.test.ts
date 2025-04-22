import { test } from '@chromatic-com/playwright'
import { MetadataDrawerPage } from 'e2e/pageObjects/metadataDrawer/metadataDrawerPage'

import {
  SINGLE_DATASET_PATH,
  SINGLE_DATASET_URL,
  SINGLE_RUN_PATH,
  SINGLE_RUN_URL,
} from './constants'

test.describe('Metadata Drawer', () => {
  test.use({
    // Wait for the drawer to animate before taking snapshot
    delay: 1000,
  })

  test.describe(`Single Dataset: ${SINGLE_DATASET_PATH}`, () => {
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

      // TODO: Uncomment.
      // await metadataDrawerPage.expectMetadataDrawerToShowTitle(data.title)
      await metadataDrawerPage.expandAllAccordions()
    })
  })

  test.describe(`Single Run: ${SINGLE_RUN_PATH}`, () => {
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

      // TODO: Uncomment.
      // await metadataDrawerPage.expectMetadataDrawerToShowTitle(data.title)
      await metadataDrawerPage.expandAllAccordions()
    })
  })

  test.describe(`Annotation Metadata: ${SINGLE_RUN_PATH}`, () => {
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

      // TODO: Uncomment.
      // await metadataDrawerPage.expectMetadataDrawerToShowTitle(data.title)
      await metadataDrawerPage.expandAllAccordions()
    })
  })

  test.describe(`Tomogram Metadata: ${SINGLE_RUN_PATH}`, () => {
    const url = `${SINGLE_RUN_URL}?table-tab=Tomograms`

    test('should open metadata drawer', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(url)

      await metadataDrawerPage.expectMetadataDrawerToBeHidden()
      await metadataDrawerPage.openInfoDrawer()
      await metadataDrawerPage.expectMetadataDrawerToBeVisible()
    })

    test('should close metadata drawer on click x', async ({ page }) => {
      const metadataDrawerPage = new MetadataDrawerPage(page)
      await metadataDrawerPage.goTo(url)

      await metadataDrawerPage.openInfoDrawer()
      await metadataDrawerPage.waitForMetadataDrawerToBeVisible()

      await metadataDrawerPage.closeMetadataDrawer()
      await metadataDrawerPage.expectMetadataDrawerToBeHidden()
    })
  })
})
