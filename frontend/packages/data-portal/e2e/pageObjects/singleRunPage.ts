import { Locator } from '@playwright/test'
import { SINGLE_RUN_URL } from 'e2e/constants'

import { BasePage } from './basePage'

/** /runs/$id */
export class SingleRunPage extends BasePage {
  async goToPage() {
    await this.goTo(SINGLE_RUN_URL)
  }

  getPrimaryViewTomogramButton(): Locator {
    return this.page.locator('a:has-text("View Tomogram")')
  }
}
