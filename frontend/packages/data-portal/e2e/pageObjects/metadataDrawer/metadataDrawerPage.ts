import { expect } from '@chromatic-com/playwright'
import { translations } from 'e2e/constants'
import { isArray } from 'lodash-es'
import { _DeepPartialArray } from 'utility-types/dist/mapped-types'

import { TestIds } from 'app/constants/testIds'

import { BasePage } from '../basePage'
import { DrawerTestData } from './types'

export class MetadataDrawerPage extends BasePage {
  // #region Click
  public async openViewAllInfoDrawer() {
    await this.page
      .getByRole('button', { name: translations.viewAllInfo })
      .click()
  }

  public async openInfoDrawer() {
    await this.page
      .getByRole('button', { name: translations.info, exact: true })
      .first()
      .click()
  }

  public async closeMetadataDrawer() {
    await this.getCloseButton().click()
  }

  public async expandFirstAccordion() {
    await this.getMetadataDrawer()
      .getByRole('button', { expanded: false })
      .first()
      .click()
  }
  // #endregion Click

  // #region Get
  private getMetadataDrawer() {
    return this.page.getByTestId(TestIds.MetadataDrawer)
  }

  public getCloseButton() {
    return this.page.getByTestId(TestIds.MetadataDrawerCloseButton)
  }

  public async getNumberOfAccordions() {
    return this.getMetadataDrawer()
      .getByRole('button', { expanded: false })
      .count()
  }

  private getMetadataCells(label: string) {
    return this.getMetadataDrawer().locator(`tr:has-text("${label}") td`)
  }
  // #endregion Get

  // #region Macro
  public async waitForMetadataDrawerToBeVisible() {
    await this.getMetadataDrawer().waitFor({ state: 'visible' })
  }

  public async expandAllAccordions() {
    const nUnexpandedAccordions = await this.getNumberOfAccordions()

    // We expand the accordions one by one because clicking on all of them
    // programatically will break playwright. Assume the Playwright locator
    // finds two accordions and stores their locator nodes in 0 and 1. If we
    // click on 0, the node is changed to have the attribute expanded=true,
    // resulting in the locator updating and changing the node in 1 to 0.
    //
    // To get around this, we get a count of unexpanded accordions and click
    // on the first accordion we find in the drawer.
    for (let i = 0; i < nUnexpandedAccordions; i += 1) {
      await this.expandFirstAccordion()
    }
  }
  // #endregion Macro

  // #region Validation
  public async expectMetadataDrawerToBeVisible() {
    await expect(this.getMetadataDrawer()).toBeVisible()
  }

  public async expectMetadataDrawerToBeHidden() {
    await expect(this.getMetadataDrawer()).toBeHidden()
  }

  public async expectMetadataDrawerToShowTitle(text: string) {
    await expect(this.getMetadataDrawer()).toContainText(text)
  }

  public async expectMetadataTableCellToDisplayList(
    label: string,
    value: _DeepPartialArray<string>,
  ) {
    const cells = this.getMetadataCells(label)
    const nodeValue = (await cells.last().innerText()).replaceAll('\n', '')
    expect(
      value.every((v) => nodeValue.includes(v ?? '')),
      `Test for ${label} with value ${nodeValue} to include ${value.join(
        ', ',
      )}`,
    ).toBe(true)
  }

  public async expectMetadataTableCellToDisplayValue(
    label: string,
    value: string | number,
  ) {
    const cells = this.getMetadataCells(label)

    await expect(
      cells.last(),
      `Test for ${label} to have value ${value}`,
    ).toContainText(`${value}`)
  }

  public async expectMetadataTableCellToDisplayNotApplicable(label: string) {
    const cells = this.getMetadataCells(label)

    await expect(
      cells.last(),
      `Test for ${label} to be "Not Applicable"`,
    ).toContainText('Not Applicable')
  }

  public async expectMetadataTableCellToDisplayEmpty(label: string) {
    const cells = this.getMetadataCells(label)

    await expect(cells.last(), `Test for ${label} to be empty`).toContainText(
      '--',
    )
  }

  public async expectMetadataTableCellsToDisplayValues(data: DrawerTestData) {
    for (const [key, value] of Object.entries(data.metadata)) {
      const label = translations[key as keyof typeof translations]

      // Array:
      if (isArray(value)) {
        await this.expectMetadataTableCellToDisplayList(label, value)
        continue
      }
      // String or Number:
      if (value !== null) {
        await this.expectMetadataTableCellToDisplayValue(label, value)
        continue
      }
      // Empty because N/A:
      if (
        data.metadata.groundTruthStatus &&
        ['groundTruthUsed', 'precision', 'recall'].includes(key)
      ) {
        await this.expectMetadataTableCellToDisplayNotApplicable(label)
        continue
      }
      await this.expectMetadataTableCellToDisplayEmpty(label)
    }
  }
  // #endregion Validation
}
