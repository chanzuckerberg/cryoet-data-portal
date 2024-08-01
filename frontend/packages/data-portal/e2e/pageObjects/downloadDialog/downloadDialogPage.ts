import { Locator } from '@playwright/test'
import { expect } from '@playwright/test'
import { BasePage } from 'e2e/pageObjects/basePage'

export class DownloadDialogPage extends BasePage {
  // #region Navigate
  // #endregion Navigate

  // #region Click
  public async openDialog(name: string): Promise<void> {
    await this.page.getByRole('button', { name }).click()
  }
  // #endregion Click

  // #region Hover
  // #endregion Hover

  // #region Get
  public getDialog(): Locator {
    return this.page.getByRole('dialog')
  }
  // #endregion Get

  // #region Macro
  // #endregion Macro

  // #region Validation
  public async expectDialogToBeVisible(dialog: Locator) {
    await expect(dialog).toBeVisible()
  }

  public async expectDialogToHaveTitle(dialog: Locator, title: string) {
    await expect(dialog.getByRole('heading').first()).toHaveText(title)
  }

  public async expectSubstringToBeVisible(dialog: Locator, str: string) {
    await expect(dialog.getByText(str)).toBeVisible()
  }
  // #endregion Validation
  // #region Bool
  // #endregion Bool
}
