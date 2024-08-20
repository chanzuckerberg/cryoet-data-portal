import { Locator } from '@playwright/test'

import { BasePage } from './basePage'

/** neuroglancer-demo.appspot.com */
export class NeuroglancerPage extends BasePage {
  findViewer(): Locator {
    return this.page.locator('.neuroglancer-viewer')
  }

  findErrorText(): Locator {
    return this.page.getByText('Error')
  }
}
