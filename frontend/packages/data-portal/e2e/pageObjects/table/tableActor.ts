import { expect } from '@chromatic-com/playwright'
import { waitForTableReload } from 'e2e/utils'

import { QueryParams } from 'app/constants/query'

import { TablePage } from './tablePage'

export class TableActor {
  constructor(private tablePage: TablePage) {}

  async expectResultWithUrlParam(param: QueryParams, value: string) {
    await expect(
      this.tablePage.getResultLink({ param, value, index: 0 }),
    ).toBeVisible()
  }

  async openFirstResult(param?: QueryParams, value?: string) {
    await this.tablePage.getResultLink({ index: 0, param, value }).click()
    await waitForTableReload(this.tablePage.page)
    await this.tablePage.waitForInteractive()
  }
}
