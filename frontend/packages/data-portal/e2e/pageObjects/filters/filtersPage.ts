import { expect } from '@playwright/test'
import { BasePage } from 'e2e/pageObjects/basePage'

import { TestIds } from 'app/constants/testIds'

export class FiltersPage extends BasePage {
  // #region Navigate

  // #endregion Navigate

  // #region Click
  public async openFilterDropdown(label: string) {
    await this.page.getByRole('button', { name: label }).click()
  }

  public async selectFilterOption(label: string) {
    await this.page
      .getByRole('option', { name: label })
      .locator('span')
      .first()
      .click()

    await this.page.keyboard.press('Escape')
  }

  public async removeFilterOption(label: string) {
    await this.page.click(`[role=button]:has-text("${label}") svg`)
  }
  // #endregion Click

  // #region Hover
  // #endregion Hover

  // #region Get
  public async getAllDatasetIds() {
    const allDatasetRows = await this.page.getByText(/Dataset ID: [0-9]+/).all()
    return Promise.all(
      allDatasetRows.map(async (node) => {
        const text = await node.innerText()
        return text.replace('Dataset ID: ', '')
      }),
    )
  }

  public async getAnnotationIdsFromTable() {
    return this.page.getByTestId(TestIds.AnnotationId).allInnerTexts()
  }
  // #endregion Get

  // #region Macro
  public async waitForTableCountChange({
    countLabel,
    expectedFilterCount,
    expectedTotalCount,
  }: {
    countLabel: string
    expectedFilterCount: number
    expectedTotalCount: number
  }) {
    await this.page
      .getByText(
        new RegExp(
          `^${expectedFilterCount} of ${expectedTotalCount} ${countLabel}$`,
        ),
      )
      .waitFor()
  }
  // #endregion Macro

  // #region Validation
  public async expectNavigationToMatch(expectedUrl: string) {
    await this.page.waitForURL(expectedUrl)
  }

  public expectIdsToMatch(dataIds: Set<number>, tableIds: string[]) {
    const expectedIdsArray = Array.from(dataIds)
    expect(tableIds.length).toBe(dataIds.size)
    tableIds.forEach((id) =>
      expect(
        dataIds.has(+id),
        `Check if table annotation ${id} is found within available data Ids: ${expectedIdsArray.join(
          ', ',
        )}`,
      ).toBe(true),
    )
  }
  // #endregion Validation

  // #region Bool
  // #endregion Bool
}
