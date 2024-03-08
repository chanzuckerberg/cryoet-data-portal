import { expect, test } from '@playwright/test'
import { getApolloClient } from 'e2e/apollo'
import { goTo, skipClipboardTestsForWebkit } from 'e2e/filters/utils'

import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { DownloadTab } from 'app/types/download'

import { E2E_CONFIG, SINGLE_DATASET_URL, translations } from '../constants'
import {
  constructDialogUrl,
  expectClickToSwitchTab,
  expectTabSelected,
  getIconButton,
  validateDialogOpen,
} from './utils'

async function fetchData() {
  const client = getApolloClient()
  return getDatasetById({ client, id: +E2E_CONFIG.datasetId })
}

export function testSingleDatasetDownloadDialog() {
  test.describe('Single Dataset', () => {
    test('should open when clicking download button', async ({ page }) => {
      await goTo(page, SINGLE_DATASET_URL)
      await page
        .getByRole('button', { name: translations.downloadDataset })
        .click()
      await validateDialogOpen(page, translations.downloadOptions)
      const expectedUrl = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.AWS,
      })
      await page.waitForURL(expectedUrl.href)
    })

    test('should display dataset name', async ({ page }) => {
      await goTo(page, SINGLE_DATASET_URL)
      await page
        .getByRole('button', { name: translations.downloadDataset })
        .click()
      const { data } = await fetchData()
      await validateDialogOpen(page, translations.downloadOptions, [
        `${translations.dataset}: ${data.datasets[0].title}`,
      ])
      const expectedUrl = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.AWS,
      })
      await page.waitForURL(expectedUrl.href)
    })

    test('should open aws tab via url', async ({ page }) => {
      const initialUrl = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.AWS,
      })

      await goTo(page, initialUrl.href)
      const dialog = await validateDialogOpen(
        page,
        translations.downloadOptions,
      )

      await expectTabSelected(dialog, translations.viaAwsS3)
      await expectTabSelected(dialog, translations.viaApi, false)
    })

    test('should open api tab via url', async ({ page }) => {
      const initialUrl = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.API,
      })

      await goTo(page, initialUrl.href)
      const dialog = await validateDialogOpen(
        page,
        translations.downloadOptions,
      )

      await expectTabSelected(dialog, translations.viaAwsS3, false)
      await expectTabSelected(dialog, translations.viaApi)
    })

    test('should open api tab by clicking', async ({ page }) => {
      const initialUrl = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.AWS,
      })
      const expectedUrl = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.API,
      })

      await goTo(page, initialUrl.href)
      const dialog = await validateDialogOpen(
        page,
        translations.downloadOptions,
      )

      await expectClickToSwitchTab(
        dialog,
        translations.viaAwsS3,
        translations.viaApi,
      )

      await page.waitForURL(expectedUrl.href)
    })

    test('should open aws tab by clicking', async ({ page }) => {
      const initialUrl = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.API,
      })
      const expectedUrl = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.AWS,
      })

      await goTo(page, initialUrl.href)
      const dialog = await validateDialogOpen(
        page,
        translations.downloadOptions,
      )

      await expectClickToSwitchTab(
        dialog,
        translations.viaApi,
        translations.viaAwsS3,
      )

      await page.waitForURL(expectedUrl.href)
    })

    test('should copy from aws tab', async ({ page, browserName }) => {
      skipClipboardTestsForWebkit(browserName)

      const url = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.AWS,
      })

      await goTo(page, url.href)

      const dialog = await validateDialogOpen(
        page,
        translations.downloadOptions,
      )
      await dialog.getByRole('button', { name: translations.copy }).click()

      const handle = await page.evaluateHandle(() =>
        navigator.clipboard.readText(),
      )
      const clipboardValue = await handle.jsonValue()
      expect(clipboardValue).toContain('aws s3')
      expect(clipboardValue).toContain(E2E_CONFIG.datasetId)
    })

    test('should copy from api tab', async ({ page, browserName }) => {
      skipClipboardTestsForWebkit(browserName)

      const url = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.API,
      })

      await goTo(page, url.href)

      const dialog = await validateDialogOpen(
        page,
        translations.downloadOptions,
      )
      await dialog.getByRole('button', { name: translations.copy }).click()

      const handle = await page.evaluateHandle(() =>
        navigator.clipboard.readText(),
      )
      const clipboardValue = await handle.jsonValue()
      expect(clipboardValue).toBe(E2E_CONFIG.datasetId)
    })

    test('should close when x button clicked', async ({ page }) => {
      const url = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.AWS,
      })

      await goTo(page, url.href)

      const dialog = await validateDialogOpen(
        page,
        translations.downloadOptions,
      )

      await getIconButton(dialog).click()

      await expect(dialog).toBeHidden()
    })

    test('should close when close button clicked', async ({ page }) => {
      const url = constructDialogUrl(SINGLE_DATASET_URL, {
        tab: DownloadTab.AWS,
      })

      await goTo(page, url.href)

      const dialog = await validateDialogOpen(
        page,
        translations.downloadOptions,
      )

      await dialog.getByRole('button', { name: translations.close }).click()

      await expect(dialog).toBeHidden()
    })
  })
}
