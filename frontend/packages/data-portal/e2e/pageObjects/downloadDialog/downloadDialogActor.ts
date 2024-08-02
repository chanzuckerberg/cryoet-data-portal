/**
 * This file contains combinations of page interactions or data fetching. Remove if not needed.
 */
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { expect } from '@playwright/test'
import { E2E_CONFIG, SINGLE_DATASET_URL, translations } from 'e2e/constants'
import { DownloadDialogPage } from 'e2e/pageObjects/downloadDialog/downloadDialogPage'

import { getDatasetCodeSnippet } from 'app/components/Download/APIDownloadTab'
import { DownloadTab } from 'app/types/download'

import { singleDatasetDownloadTab } from './types'
import { constructDialogUrl, fetchTestSingleDataset } from './utils'

export class DownloadDialogActor {
  private downloadDialogPage: DownloadDialogPage

  constructor(downloadDialogPage: DownloadDialogPage) {
    this.downloadDialogPage = downloadDialogPage
  }

  // #region Navigate
  public async goToDownloadTabUrl({
    url,
    tab,
  }: {
    url: string
    tab: DownloadTab
  }) {
    const expectedUrl = constructDialogUrl(url, {
      tab,
    })
    await this.downloadDialogPage.goTo(expectedUrl.href)
  }
  // #endregion Navigate

  // #region Click
  // #endregion Click

  // #region Hover
  // #endregion Hover

  // #region Get
  // #endregion Get

  // #region Macro
  // #endregion Macro

  // #region Validation
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

  public async expectDialogToShowCorrectContent({
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

  public async expectDialogToBeOnCorrectTab({ tab }: { tab: DownloadTab }) {
    const dialog = this.downloadDialogPage.getDialog()
    await this.downloadDialogPage.expectTabSelected({
      dialog,
      tab,
      isSelected: true,
    })

    await Promise.all(
      Object.values(singleDatasetDownloadTab).map(async (t) => {
        if (t !== tab) {
          await this.downloadDialogPage.expectTabSelected({
            dialog,
            tab: t,
            isSelected: false,
          })
        }
      }),
    )
  }

  public async expectClipboardToHaveCorrectAwsValue() {
    const clipboard = await this.downloadDialogPage.getClipboardHandle()
    const clipboardValue = await clipboard.jsonValue()
    expect(clipboardValue).toContain('aws s3')
    expect(clipboardValue).toContain(E2E_CONFIG.datasetId)
  }

  public async expectClipboardToHaveCorrectApiValue() {
    const clipboard = await this.downloadDialogPage.getClipboardHandle()
    const clipboardValue = await clipboard.jsonValue()
    expect(clipboardValue).toBe(getDatasetCodeSnippet(+E2E_CONFIG.datasetId))
  }
  // #endregion Validation
}
