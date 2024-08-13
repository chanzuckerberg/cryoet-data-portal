import { Locator } from '@playwright/test'

import { BasePage } from './basePage'

export class NeuroglancerPage extends BasePage {
  findViewer(): Locator {
    return this.page.locator('.neuroglancer-viewer')
  }

  findErrorText(): Locator {
    return this.page.getByText('Error')
  }
}
