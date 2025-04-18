import { waitForTableReload } from 'e2e/utils'

import { FiltersPage } from './filtersPage'
import { MultiInputFilterType, QueryParamObjectType } from './types'
import { getExpectedUrlWithQueryParams } from './utils'

export class FiltersActor {
  private filtersPage: FiltersPage

  constructor(filtersPage: FiltersPage) {
    this.filtersPage = filtersPage
  }

  // #region Navigation
  public async goToFilteredUrl({
    baseUrl,
    queryParamsList,
    serialize,
  }: {
    baseUrl: string
    queryParamsList: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const url = this.filtersPage.getFilteredUrl({
      baseUrl,
      queryParamsList,
      serialize,
    })
    await this.filtersPage.goTo(url.href)
  }

  // #region Macro
  public async addSingleSelectFilter({
    label,
    value,
  }: {
    label: string
    value: string
  }) {
    await this.filtersPage.clickFilterDropdown(label)
    await this.filtersPage.selectFilterOption(value)
    // Click again to close
    await this.filtersPage.clickFilterDropdown(label)
    await waitForTableReload(this.filtersPage.page)
  }

  public async addMultiInputFilter({
    buttonLabel,
    filter,
    hasMultipleFilters,
  }: {
    buttonLabel: string
    filter: MultiInputFilterType
    hasMultipleFilters: boolean
  }) {
    await this.filtersPage.clickFilterDropdown(buttonLabel)
    await this.filtersPage.fillInputFilter({
      label: `${filter.label}${hasMultipleFilters ? ':' : ''}`,
      value: filter.value,
    })
    await this.filtersPage.applyMultiInputFilter()
  }

  // #region Validate
  public async expectUrlQueryParamsToBeCorrect({
    url,
    queryParamsList,
    serialize,
  }: {
    url: string
    queryParamsList: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const { expectedUrl } = getExpectedUrlWithQueryParams({
      url,
      queryParamsList,
      serialize,
    })

    await this.filtersPage.expectNavigationToMatch(expectedUrl.href)
  }
}
