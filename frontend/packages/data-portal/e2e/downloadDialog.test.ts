import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { test } from '@playwright/test'
import { DownloadDialogPage } from 'e2e/pageObjects/downloadDialog/downloadDialogPage'

import { DownloadTab } from 'app/types/download'

import { SINGLE_DATASET_URL, translations } from './constants'
import { DownloadDialogActor } from './pageObjects/downloadDialog/downloadDialogActor'

test.describe('downloadDialog', () => {
  let client: ApolloClient<NormalizedCacheObject>
  let downloadDialogPage: DownloadDialogPage
  let downloadDialogActor: DownloadDialogActor

  test.beforeEach(({ page }) => {
    downloadDialogPage = new DownloadDialogPage(page)
    downloadDialogActor = new DownloadDialogActor(downloadDialogPage)
  })

  test('should open when clicking download button', async () => {
    await downloadDialogPage.goTo(SINGLE_DATASET_URL)
    await downloadDialogPage.openDialog(translations.downloadDataset)

    await downloadDialogActor.expectDialogToBeOpen({
      title: translations.downloadOptions,
    })
    await downloadDialogActor.expectDialogUrlToMatch({ tab: DownloadTab.AWS })
  })

  test('should display dataset name', async () => {
    await downloadDialogPage.goTo(SINGLE_DATASET_URL)
    await downloadDialogPage.openDialog(translations.downloadDataset)
    await downloadDialogActor.expectDialogToShowCorrectTitle({ client })
    await downloadDialogActor.expectDialogUrlToMatch({ tab: DownloadTab.AWS })
  })
})
