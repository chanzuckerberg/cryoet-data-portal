/**
 * This file contains combinations of page interactions or data fetching. Remove if not needed.
 */
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { SINGLE_DATASET_URL, translations } from 'e2e/constants'
import { DownloadDialogPage } from 'e2e/pageObjects/downloadDialog/downloadDialogPage'

import { DownloadTab } from 'app/types/download'

import { constructDialogUrl, fetchTestSingleDataset } from './utils'

export class DownloadDialogActor {
  private downloadDialogPage: DownloadDialogPage

  constructor(downloadDialogPage: DownloadDialogPage) {
    this.downloadDialogPage = downloadDialogPage
  }

  public async expectDialogToBeOpen({
    title,
    substrings,
  }: {
    title: string
    substrings?: string[]
  }) {
    const dialog = this.downloadDialogPage.getDialog()
    await this.downloadDialogPage.expectDialogToBeVisible(dialog)
    await this.downloadDialogPage.expectDialogToHaveTitle(dialog, title)
    if (substrings) {
      await Promise.all(
        substrings.map(async (str) => {
          await this.downloadDialogPage.expectSubstringToBeVisible(dialog, str)
        }),
      )
    }
  }

  public async expectDialogToShowCorrectTitle({
    client,
  }: {
    client: ApolloClient<NormalizedCacheObject>
  }) {
    const { data } = await fetchTestSingleDataset(client)
    await this.expectDialogToBeOpen({
      title: translations.downloadOptions,
      substrings: [`${translations.dataset}: ${data.datasets[0].title}`],
    })
  }

  public async expectDialogUrlToMatch({ tab }: { tab: DownloadTab }) {
    const expectedUrl = constructDialogUrl(SINGLE_DATASET_URL, {
      tab,
    })
    await this.downloadDialogPage.page.waitForURL(expectedUrl.href)
  }
}
