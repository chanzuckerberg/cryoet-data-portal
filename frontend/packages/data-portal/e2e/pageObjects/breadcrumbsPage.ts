import { QueryParams } from 'app/constants/query'
import { TestIds } from 'app/constants/testIds'

import { BasePage } from './basePage'

export class BreadcrumbsPage extends BasePage {
  getBreadcrumb({
    index,
    param,
    value,
  }: {
    index: number
    param?: QueryParams
    value?: string
  }) {
    return this.page
      .getByTestId(TestIds.Breadcrumbs)
      .locator(this.getUrlWithParamSelector(param, value))
      .nth(index)
  }
}
