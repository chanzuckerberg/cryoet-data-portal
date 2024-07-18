import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { translations } from 'e2e/constants'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import { QueryParams } from 'app/constants/query'
import { getRunById } from 'app/graphql/getRunById.server'

import { FiltersPage } from './filtersPage'
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

  // #region Data
  public async getSingleRunDataWithParams({
    client,
    id,
    pageNumber,
    url,
    queryParam,
    value,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    id: number
    pageNumber?: number
    url: string
    queryParam?: QueryParams
    value: string
    serialize?: (value: string) => string
  }) {
    const { params } = getExpectedUrlWithQueryParams({
      url,
      queryParam,
      value,
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

  // #endregion Macro

  // #region Validate
  public async expectUrlQueryParamsToBeCorrect({
    url,
    queryParam,
    value,
    serialize,
  }: {
    url: string
    queryParam?: QueryParams
    value: string
    serialize?: (value: string) => string
  }) {
    const { expectedUrl } = getExpectedUrlWithQueryParams({
      url,
      queryParam,
      value,
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
  // #endregion Validate
}
