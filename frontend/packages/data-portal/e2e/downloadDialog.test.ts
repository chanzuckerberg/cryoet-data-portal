import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { DownloadDialogPage } from 'e2e/pageObjects/downloadDialog/downloadDialogPage'

import { DownloadTab } from 'app/types/download'

import { getApolloClient } from './apollo'
import { SINGLE_DATASET_URL, translations } from './constants'
import { DownloadDialogActor } from './pageObjects/downloadDialog/downloadDialogActor'
import { skipClipboardTestsForWebkit } from './pageObjects/downloadDialog/utils'

test.describe('downloadDialog', () => {
  let client: ApolloClient<NormalizedCacheObject>
  let downloadDialogPage: DownloadDialogPage
  let downloadDialogActor: DownloadDialogActor

  test.beforeEach(({ page }) => {
    client = getApolloClient()
    downloadDialogPage = new DownloadDialogPage(page)
    downloadDialogActor = new DownloadDialogActor(downloadDialogPage)
  })

  test.describe('Single Dataset', () => {
    test('should open when clicking download button', async () => {
      await downloadDialogPage.goTo(SINGLE_DATASET_URL)
      await downloadDialogPage.openDialog(translations.downloadDataset)

      await downloadDialogActor.expectDialogToBeOpen({
        title: translations.downloadOptions,
      })
      await downloadDialogActor.expectDialogUrlToMatch({ tab: DownloadTab.AWS })
    })

    test('should display correct content', async () => {
      await downloadDialogPage.goTo(SINGLE_DATASET_URL)
      await downloadDialogPage.openDialog(translations.downloadDataset)

      await downloadDialogActor.expectDialogToShowCorrectContent({ client })
      await downloadDialogActor.expectDialogUrlToMatch({ tab: DownloadTab.AWS })
    })

    test.describe('AWS Tab', () => {
      test('should open tab via url', async () => {
        await downloadDialogActor.goToDownloadTabUrl({
          url: SINGLE_DATASET_URL,
          tab: DownloadTab.AWS,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.AWS,
        })
      })

      test('should open tab when clicking', async () => {
        await downloadDialogActor.goToDownloadTabUrl({
          url: SINGLE_DATASET_URL,
          tab: DownloadTab.API,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogPage.clickTab(DownloadTab.AWS)

        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.AWS,
        })
        await downloadDialogActor.expectDialogUrlToMatch({
          tab: DownloadTab.AWS,
        })
      })

      test('should copy from aws tab', async ({ browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        await downloadDialogActor.goToDownloadTabUrl({
          url: SINGLE_DATASET_URL,
          tab: DownloadTab.AWS,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogPage.clickCopyButton()

        await downloadDialogActor.expectClipboardToHaveCorrectAwsValue()
      })

      test('should close dialog', async () => {
        await downloadDialogActor.goToDownloadTabUrl({
          url: SINGLE_DATASET_URL,
          tab: DownloadTab.AWS,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogPage.clickCloseButton()

        await downloadDialogPage.expectDialogToBeHidden()
      })
    })

    test.describe('API Tab', () => {
      test('should open api tab via url', async () => {
        await downloadDialogActor.goToDownloadTabUrl({
          url: SINGLE_DATASET_URL,
          tab: DownloadTab.API,
        })

        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.API,
        })
      })

      test('should open api tab by clicking', async () => {
        await downloadDialogActor.goToDownloadTabUrl({
          url: SINGLE_DATASET_URL,
          tab: DownloadTab.AWS,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogPage.clickTab(DownloadTab.API)

        await downloadDialogActor.expectDialogToBeOnCorrectTab({
          tab: DownloadTab.API,
        })
        await downloadDialogActor.expectDialogUrlToMatch({
          tab: DownloadTab.API,
        })
      })

      test('should copy from api tab', async ({ browserName }) => {
        skipClipboardTestsForWebkit(browserName)

        await downloadDialogActor.goToDownloadTabUrl({
          url: SINGLE_DATASET_URL,
          tab: DownloadTab.API,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogPage.clickCopyButton()

        await downloadDialogActor.expectClipboardToHaveCorrectApiValue()
      })
      test('should close dialog', async () => {
        await downloadDialogActor.goToDownloadTabUrl({
          url: SINGLE_DATASET_URL,
          tab: DownloadTab.API,
        })
        await downloadDialogActor.expectDialogToBeOpen({
          title: translations.downloadOptions,
        })
        await downloadDialogPage.clickCloseButton()

        await downloadDialogPage.expectDialogToBeHidden()
      })
    })
  })
})
