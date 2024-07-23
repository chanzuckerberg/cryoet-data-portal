import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { E2E_CONFIG, translations } from 'e2e/constants'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import { QueryParams } from 'app/constants/query'
import { getRunById } from 'app/graphql/getRunById.server'

import { FiltersPage } from './filtersPage'
import { MultiInputFilterType } from './types'
import {
  getAnnotationRowCountFromData,
  getExpectedFilterCount,
  getExpectedTotalCount,
  getExpectedUrlWithQueryParams,
} from './utils'

export class FiltersActor {
  private filtersPage: FiltersPage

  constructor(filtersPage: FiltersPage) {
    this.filtersPage = filtersPage
  }

  // #region Navigation
  public async goToFilteredUrl({
    baseUrl,
    paramObject,
  }: {
    baseUrl: string
    paramObject: Record<string, string>
  }) {
    const url = this.filtersPage.getFilteredUrl({ baseUrl, paramObject })
    await this.filtersPage.goTo(url.href)
  }
  // #endregion Navigation

  // #region Data
  public async getSingleRunDataWithParams({
    client,
    id,
    pageNumber,
    url,
    queryParamKey,
    queryParamValue,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    id: number
    pageNumber?: number
    url: string
    queryParamKey?: QueryParams
    queryParamValue: string
    serialize?: (value: string) => string
  }) {
    const { params } = getExpectedUrlWithQueryParams({
      url,
      queryParamKey,
      queryParamValue,
      serialize,
    })

    const { data } = await getRunById({
      client,
      params,
      id,
      page: pageNumber,
    })

    return data
  }
  // #endregion Data

  // #region Macro
  public async addSingleSelectFilter({
    label,
    value,
  }: {
    label: string
    value: string
  }) {
    await this.filtersPage.openFilterDropdown(label)
    await this.filtersPage.selectFilterOption(value)
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
    await this.filtersPage.openFilterDropdown(buttonLabel)
    await this.filtersPage.fillInputFilter({
      label: `${filter.label}${hasMultipleFilters ? ':' : ''}`,
      value: E2E_CONFIG[filter.value] as string,
    })
    await this.filtersPage.applyMultiInputFilter()
  }

  // #endregion Macro

  // #region Validate
  public async expectUrlQueryParamsToBeCorrect({
    url,
    queryParamKey,
    queryParamValue,
    serialize,
  }: {
    url: string
    queryParamKey?: QueryParams
    queryParamValue: string
    serialize?: (value: string) => string
  }) {
    const { expectedUrl } = getExpectedUrlWithQueryParams({
      url,
      queryParamKey,
      queryParamValue,
      serialize,
    })

    await this.filtersPage.expectNavigationToMatch(expectedUrl.href)
  }

  public async expectAnnotationsTableToBeCorrect({
    singleRunData,
  }: {
    singleRunData: GetRunByIdQuery
  }) {
    // Extract expectedFilterCount and expectedTotalCount from data
    const expectedFilterCount = getExpectedFilterCount({ singleRunData })
    const expectedTotalCount = getExpectedTotalCount({ singleRunData })

    // Wait for table subtitle to be correct: `^${expectedFilterCount} of ${expectedTotalCount} ${countLabel}$`
    await this.filtersPage.waitForTableCountChange({
      countLabel: translations.annotations,
      expectedFilterCount,
      expectedTotalCount,
    })

    // Validate rows
    // Get all annotation ids from the expected data
    const annotationRowCountFromData = getAnnotationRowCountFromData({
      singleRunData,
    })
    // Get all annotation ids from the table
    const annotationRowCountFromTable =
      await this.filtersPage.getAnnotationRowCountFromTable()

    // Ensure all annotation ids from the expected data are in the table
    this.filtersPage.expectRowCountsToMatch(
      annotationRowCountFromData,
      annotationRowCountFromTable,
    )
  }

  public async expectDataAndAnnotationsTableToMatch({
    client,
    id,
    pageNumber,
    url,
    queryParamKey,
    queryParamValue,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    id: number
    pageNumber?: number
    url: string
    queryParamKey?: QueryParams
    queryParamValue: string
    serialize?: (value: string) => string
  }) {
    const singleRunData = await this.getSingleRunDataWithParams({
      client,
      id,
      pageNumber,
      url,
      queryParamKey,
      queryParamValue,
      serialize,
    })

    await this.expectAnnotationsTableToBeCorrect({ singleRunData })
  }
  // #endregion Validate
}
