import { QueryParams } from 'app/constants/query'

import { BasePage } from '../basePage'

export class TablePage extends BasePage {
  getNthRow(index: number) {
    return this.page.locator('tbody').locator('tr').nth(index)
  }

  getResultLink({
    index,
    param,
    value,
  }: {
    index: number
    param?: QueryParams
    value?: string
  }) {
    return this.getNthRow(index)
      .locator(this.getUrlWithParamSelector(param, value))
      .first()
  }
}
