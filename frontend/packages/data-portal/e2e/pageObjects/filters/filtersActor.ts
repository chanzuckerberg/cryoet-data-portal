import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { translations } from 'e2e/constants'

import {
  GetDatasetByIdQuery,
  GetDatasetsDataQuery,
  GetRunByIdQuery,
} from 'app/__generated__/graphql'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'
import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { getRunById } from 'app/graphql/getRunById.server'

import { FiltersPage } from './filtersPage'
import { MultiInputFilterType, QueryParamObjectType } from './types'
import {
  getAnnotationRowCountFromData,
  getDatasetIdCountsFromData,
  getExpectedFilterCount,
  getExpectedTotalCount,
  getExpectedUrlWithQueryParams,
  getFilteredOrganismNamesFromData,
  getRunIdCountsFromData,
} from './utils'

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
  // #endregion Navigation

  // #region Data
  public async getSingleRunDataUsingParams({
    client,
    id,
    pageNumber = 1,
    url,
    queryParamsList,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    id: number
    pageNumber: number
    url: string
    queryParamsList: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const { params } = getExpectedUrlWithQueryParams({
      url,
      queryParamsList,
      serialize,
    })

    const { data } = await getRunById({
      client,
      params,
      id,
      annotationsPage: pageNumber,
    })

    return data
  }

  public async getSingleDatasetUsingParams({
    client,
    id,
    pageNumber = 1,
    url,
    queryParamsList,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    id: number
    pageNumber?: number
    url: string
    queryParamsList: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const { params } = getExpectedUrlWithQueryParams({
      url,
      queryParamsList,
      serialize,
    })

    const { data } = await getDatasetById({
      client,
      id,
      params,
      page: pageNumber,
    })

    return data
  }

  public async getDatasetsDataUsingParams({
    client,
    pageNumber = 1,
    url,
    queryParamsList,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    pageNumber?: number
    url: string
    queryParamsList?: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const { params } = getExpectedUrlWithQueryParams({
      url,
      queryParamsList,
      serialize,
    })

    const { data } = await getBrowseDatasets({
      client,
      params,
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
      value: filter.value,
    })
    await this.filtersPage.applyMultiInputFilter()
  }

  // #endregion Macro

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
    id = 1,
    pageNumber,
    url,
    queryParamsList,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    id: number
    pageNumber: number
    url: string
    queryParamsList: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const singleRunData = await this.getSingleRunDataUsingParams({
      client,
      id,
      pageNumber,
      url,
      queryParamsList,
      serialize,
    })

    await this.expectAnnotationsTableToBeCorrect({ singleRunData })
  }

  public async expectRunsTableToBeCorrect({
    singleDatasetData,
  }: {
    singleDatasetData: GetDatasetByIdQuery
  }) {
    // Extract expectedFilterCount and expectedTotalCount from data
    const expectedFilterCount = getExpectedFilterCount({ singleDatasetData })
    const expectedTotalCount = getExpectedTotalCount({ singleDatasetData })

    // Wait for table subtitle to be correct: `^${expectedFilterCount} of ${expectedTotalCount} ${countLabel}$`
    await this.filtersPage.waitForTableCountChange({
      countLabel: translations.runs,
      expectedFilterCount,
      expectedTotalCount,
    })

    // Validate rows
    // Get all run ids from the expected data
    const runIdCountFromData = getRunIdCountsFromData({ singleDatasetData })
    // Get all run rows from the table
    const runRowCountFromTable =
      await this.filtersPage.getRunRowCountFromTable()

    // Ensure all run ids from the expected data are in the table
    this.filtersPage.expectRowCountsToMatch(
      runIdCountFromData,
      runRowCountFromTable,
    )
  }

  public async expectDataAndRunsTableToMatch({
    client,
    id = 1,
    pageNumber,
    url,
    queryParamsList,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    id: number
    pageNumber?: number
    url: string
    queryParamsList: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const singleDatasetData = await this.getSingleDatasetUsingParams({
      client,
      id,
      pageNumber,
      url,
      queryParamsList,
      serialize,
    })

    await this.expectRunsTableToBeCorrect({ singleDatasetData })
  }

  public async expectDatasetsTableToBeCorrect({
    browseDatasetsData,
  }: {
    browseDatasetsData: GetDatasetsDataQuery
  }) {
    // Extract expectedFilterCount and expectedTotalCount from data
    const expectedFilterCount = getExpectedFilterCount({ browseDatasetsData })
    const expectedTotalCount = getExpectedTotalCount({ browseDatasetsData })

    // Wait for table subtitle to be correct: `^${expectedFilterCount} of ${expectedTotalCount} ${countLabel}$`
    await this.filtersPage.waitForTableCountChange({
      countLabel: translations.datasets,
      expectedFilterCount,
      expectedTotalCount,
    })

    // Validate rows
    // Get all dataset ids from the expected data
    const datasetIdCountFromData = getDatasetIdCountsFromData({
      browseDatasetsData,
    })
    // Get all dataset rows from the table
    const datasetRowCountFromTable =
      await this.filtersPage.getDatasetRowCountFromTable()

    // Ensure all dataset ids from the expected data are in the table
    this.filtersPage.expectRowCountsToMatch(
      datasetIdCountFromData,
      datasetRowCountFromTable,
    )
  }

  public async expectDataAndDatasetsTableToMatch({
    client,
    pageNumber = 1,
    url,
    queryParamsList,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    pageNumber?: number
    url: string
    queryParamsList: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const browseDatasetsData = await this.getDatasetsDataUsingParams({
      client,
      pageNumber,
      url,
      queryParamsList,
      serialize,
    })

    await this.expectDatasetsTableToBeCorrect({ browseDatasetsData })
  }

  // TODO: this matches the existing test by checking for values from the filtered data in the UI list
  // However, we may want to add the reverse check to ensure there are no extra values in the UI list
  public async expectOrganismNamesFromDataToMatchFilterList({
    client,
    pageNumber = 1,
    testQuery,
    url,
    queryParamsList,
    serialize,
  }: {
    client: ApolloClient<NormalizedCacheObject>
    pageNumber?: number
    testQuery: string
    url: string
    queryParamsList?: QueryParamObjectType[]
    serialize?: (value: string) => string
  }) {
    const browseDatasetsData = await this.getDatasetsDataUsingParams({
      client,
      pageNumber,
      url,
      queryParamsList,
      serialize,
    })

    const organismNames = getFilteredOrganismNamesFromData({
      browseDatasetsData,
      testQuery,
    })

    await Promise.all(
      organismNames.map((name) =>
        this.filtersPage.expectOrganismNameToBeVisibleInFilterList(name),
      ),
    )
  }
  // #endregion Validate
}
