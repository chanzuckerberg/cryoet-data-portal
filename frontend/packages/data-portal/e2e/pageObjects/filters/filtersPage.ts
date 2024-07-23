import { expect } from '@playwright/test'
import { BasePage } from 'e2e/pageObjects/basePage'

import { TestIds } from 'app/constants/testIds'

import { AnnotationRowCounter } from './types'

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

  public async removeMultiInputFilter(label: string) {
    await this.page
      .locator('span', { hasText: label })
      .locator('..')
      .getByRole('button')
      .click()
  }

  public async fillInputFilter({
    label,
    value,
  }: {
    label: string
    value: string
  }) {
    await this.page.getByLabel(label).click()
    await this.page.getByLabel(label).fill(value)
  }

  public async applyMultiInputFilter() {
    await this.page.getByRole('button', { name: 'Apply' }).click()
  }
  // #endregion Click

  // #region Hover
  // #endregion Hover

  // #region Get
  public getFilteredUrl({
    baseUrl,
    paramObject,
  }: {
    baseUrl: string
    paramObject: Record<string, string>
  }) {
    const url = new URL(baseUrl)
    const params = url.searchParams
    Object.entries(paramObject).forEach(([key, value]) => {
      params.set(key, value)
    })
    return url
  }

  public async getAllDatasetIds() {
    const allDatasetRows = await this.page.getByText(/Dataset ID: [0-9]+/).all()
    return Promise.all(
      allDatasetRows.map(async (node) => {
        const text = await node.innerText()
        return text.replace('Dataset ID: ', '')
      }),
    )
  }

  public async getAnnotationRowCountFromTable(): Promise<AnnotationRowCounter> {
    const annotationRowIds = await this.page
      .getByTestId(TestIds.AnnotationId)
      .allInnerTexts()

    return annotationRowIds.reduce(
      (counter: AnnotationRowCounter, id: string) => {
        counter[id] = (counter[id] || 0) + 1
        return counter
      },
      {},
    )
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

  public expectRowCountsToMatch(
    dataRowCount: AnnotationRowCounter,
    tableRowCount: AnnotationRowCounter,
  ) {
    Object.keys(tableRowCount).forEach((id) =>
      expect(
        dataRowCount[id],
        `Check if data annotation ${id} occurs ${dataRowCount[id]} times in the table`,
      ).toEqual(tableRowCount[id]),
    )
  }
  // #endregion Validation

  // #region Bool
  // #endregion Bool
}
