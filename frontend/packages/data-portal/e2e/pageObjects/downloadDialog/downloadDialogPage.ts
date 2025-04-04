import { expect } from '@chromatic-com/playwright'
import { Locator } from '@playwright/test'
import { translations } from 'e2e/constants'
import { BasePage } from 'e2e/pageObjects/basePage'

import { DownloadConfig, DownloadTab } from 'app/types/download'

const DOWNLOAD_TAB_TO_LABEL: Record<DownloadTab, string> = {
  [DownloadTab.API]: translations.viaApi,
  [DownloadTab.AWS]: translations.viaAwsS3,
  [DownloadTab.Curl]: translations.viaCurl,
  [DownloadTab.Download]: translations.directDownload,
  [DownloadTab.PortalCLI]: translations.viaPortalCli,
}

export class DownloadDialogPage extends BasePage {
  // #region Navigate
  // #endregion Navigate

  // #region Click
  public async openDialog(name: string): Promise<void> {
    await this.page.getByRole('button', { name }).first().click()
  }

  public async clickTab(tab: DownloadTab): Promise<void> {
    const dialog = this.getDialog()
    await dialog.getByRole('tab', { name: DOWNLOAD_TAB_TO_LABEL[tab] }).click()
  }

  public async clickCopyButton(): Promise<void> {
    const dialog = this.getDialog()
    await dialog
      .getByRole('button', { name: translations.copy })
      .first()
      .click()
  }

  public async clickCloseButton(): Promise<void> {
    const dialog = this.getDialog()
    await dialog.getByRole('button', { name: translations.close }).click()
  }

  public async clickXButton(): Promise<void> {
    const dialog = this.getDialog()
    await dialog.locator('button:has(svg)').first().click()
  }

  public async clickDialogRadio(name: string): Promise<void> {
    const dialog = this.getDialog()
    await dialog.getByRole('button', { name }).click()
  }

  public async selectFileType(fileType: string): Promise<void> {
    await this.getDialog().locator('button:has-text("MRC")').click()
    await this.page.locator(`li:has-text("${fileType}")`).click()
  }

  public async clickNextButton(): Promise<void> {
    const dialog = this.getDialog()
    await dialog.getByRole('button', { name: translations.next }).click()
  }

  public async clickBackButton(): Promise<void> {
    const dialog = this.getDialog()
    await dialog.getByRole('button', { name: translations.back }).click()
  }
  // #endregion Click

  // #region Hover
  // #endregion Hover

  // #region Get
  public getDialog(): Locator {
    return this.page.getByRole('dialog')
  }

  public async getDirectDownloadHref(): Promise<string | null> {
    return this.getDialog()
      .locator(`a:has-text("${translations.downloadNow}")`)
      .getAttribute('href')
  }

  public async getClipboardHandle() {
    return this.page.evaluateHandle(() => navigator.clipboard.readText())
  }
  // #endregion Get

  // #region Macro
  // #endregion Macro

  // #region Validation
  public async expectDialogToBeVisible(dialog: Locator) {
    await expect(dialog).toBeVisible()
  }

  public async expectDialogToBeHidden() {
    const dialog = this.getDialog()
    await expect(dialog).toBeHidden()
  }

  public async expectDialogToHaveTitle(dialog: Locator, title: string) {
    await expect(dialog.getByRole('heading').first()).toHaveText(title)
  }

  public async expectSubstringToBeVisible(dialog: Locator, str: string) {
    await expect(dialog.getByText(str)).toBeVisible()
  }

  public async expectTabSelected({
    dialog,
    tab,
    isSelected,
  }: {
    dialog: Locator
    tab: DownloadTab
    isSelected: boolean
  }) {
    await expect(
      dialog.getByRole('tab', { name: DOWNLOAD_TAB_TO_LABEL[tab] }),
    ).toHaveAttribute('aria-selected', isSelected ? 'true' : 'false')
  }

  public async expectRadioToBeSelected(value: DownloadConfig) {
    const dialog = this.getDialog()
    await expect(dialog.getByRole('radio', { checked: true })).toHaveValue(
      value,
    )
  }
  // #endregion Validation
  // #region Bool
  // #endregion Bool
}
