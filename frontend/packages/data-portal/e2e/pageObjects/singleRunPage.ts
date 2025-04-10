import { Locator } from '@playwright/test'
import { SINGLE_RUN_URL } from 'e2e/constants'

import { BasePage } from './basePage'

/** /runs/$id */
export class SingleRunPage extends BasePage {
  goToPage(): Promise<void> {
    return this.goTo(SINGLE_RUN_URL)
  }

  getPrimaryViewTomogramButton(): Locator {
    return this.page.locator('a:has-text("View Tomogram")')
  }

  findProcessingMethodsCell(): Locator {
    return this.page
      .locator(`td:has-text("Tomogram Processing")`)
      .locator('+ td')
  }

  findAnnotatedObjectsCell(): Locator {
    return this.page.locator(`td:has-text("Annotated Objects")`).locator('+ td')
  }

  async findAnnotatedObjectsTexts(): Promise<Array<string>> {
    return (await this.findAnnotatedObjectsCell().textContent())!.split(',')
  }

  findAnnotatedObjectsCollapseToggle(): Locator {
    return this.findAnnotatedObjectsCell().locator('svg')
  }
}
