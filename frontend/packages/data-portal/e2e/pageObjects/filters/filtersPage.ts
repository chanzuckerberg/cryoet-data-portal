import { expect } from '@chromatic-com/playwright'
import { translations } from 'e2e/constants'
import { BasePage } from 'e2e/pageObjects/basePage'
import { waitForTableReload } from 'e2e/utils'
import { escapeRegExp } from 'lodash-es'

import { TestIds } from 'app/constants/testIds'

import { QueryParamObjectType, RowCounterType } from './types'

export class FiltersPage extends BasePage {
  // #region Navigate

  // #endregion Navigate

  // #region Click
  public async clickFilterDropdown(label: string) {
    await this.page.locator('button', { hasText: label }).click()
  }

  public async selectFilterOption(label: string) {
    await this.page
      .getByRole('option', { name: label })
      .locator('span')
      .first()
      .click()
  }

  public async removeFilterOption(label: string) {
    await this.page
      .locator('span', { hasText: new RegExp(`^${escapeRegExp(label)}$`, 'i') })
      .locator('..')
      .getByLabel('Delete tag')
      .click()
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

  public async fillSearchInput(testQuery: string) {
    const searchInput = this.page.getByRole('combobox', { name: 'Search' })
    await searchInput.click()
    await searchInput.fill(testQuery)
  }

  public async toggleGroundTruthFilter() {
    await this.page
      .getByText(translations.groundTruthAnnotationAvailableFilter)
      .click()
  }
  // #endregion Click

  // #region Hover
  // #endregion Hover

  // #region Get
  public getFilteredUrl({
    baseUrl,
    queryParamsList,
    serialize,
  }: {
    baseUrl: string
    queryParamsList: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const url = new URL(baseUrl)
    const params = url.searchParams
    queryParamsList.forEach(({ queryParamKey, queryParamValue }) => {
      if (queryParamKey) {
        params.append(
          queryParamKey,
          serialize ? serialize(queryParamValue) : queryParamValue,
        )
      }
    })
    return url
  }

  public async getAnnotationRowCountFromTable(): Promise<RowCounterType> {
    const annotationRowIds = await this.page
      .getByTestId(TestIds.AnnotationId)
      .allInnerTexts()

    return annotationRowIds.reduce((counter: RowCounterType, id: string) => {
      counter[id] = (counter[id] || 0) + 1
      return counter
    }, {})
  }

  public async getRunRowCountFromTable() {
    const allRunRows = await this.page.getByText(/Run ID: [0-9]+/).all()
    const runIds = Promise.all(
      allRunRows.map(async (node) => {
        const text = await node.innerText()
        return text.replace('Run ID: ', '')
      }),
    )
    return (await runIds).reduce((counter: RowCounterType, id: string) => {
      counter[id] = (counter[id] || 0) + 1
      return counter
    }, {})
  }

  public async getDatasetRowCountFromTable() {
    const allDatasetRows = await this.page.getByText(/Dataset ID: [0-9]+/).all()
    const datasetIds = Promise.all(
      allDatasetRows.map(async (node) => {
        const text = await node.innerText()
        return text.replace('Dataset ID: ', '')
      }),
    )
    return (await datasetIds).reduce((counter: RowCounterType, id: string) => {
      counter[id] = (counter[id] || 0) + 1
      return counter
    }, {})
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
  public async expectFilterTagToExist(label: string) {
    await expect(this.page.getByText(label, { exact: true })).toBeVisible()
  }

  public async expectNavigationToMatch(expectedUrl: string) {
    await this.page.waitForURL(expectedUrl)
  }

  public expectRowCountsToMatch(
    dataRowCount: RowCounterType,
    tableRowCount: RowCounterType,
  ) {
    Object.keys(tableRowCount).forEach((id) =>
      expect(
        dataRowCount[id],
        `Check if data id ${id} occurs ${dataRowCount[id]} times in the table`,
      ).toEqual(tableRowCount[id]),
    )
  }

  public async expectOrganismNameToBeVisibleInFilterList(organismName: string) {
    await expect(
      this.page.getByRole('option', { name: organismName }).locator('div'),
    ).toBeVisible()
  }

  public async expectAnnotationDividerCountsToMatch(
    groundTruthCount: number,
    otherCount: number,
  ) {
    const dividers = await this.page
      .getByTestId(TestIds.AnnotationTableDivider)
      .all()
    await expect(dividers[0]).toHaveText(
      new RegExp(`${groundTruthCount} Ground Truth`),
    )
    await expect(dividers[1]).toHaveText(new RegExp(`${otherCount} Other`))
  }
  // #endregion Validation

  // #region Bool
  // #endregion Bool

  async waitForTableLoad() {
    await waitForTableReload(this.page)
  }
}
