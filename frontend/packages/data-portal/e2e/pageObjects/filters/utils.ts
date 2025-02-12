import { translations } from 'e2e/constants'
import { isString } from 'lodash-es'

import {
  GetDatasetByIdQuery,
  GetDatasetsDataQuery,
  GetDatasetsFilterDataQuery,
} from 'app/__generated__/graphql'
import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'
import { AVAILABLE_FILES_VALUE_TO_I18N_MAP } from 'app/components/DatasetFilter/constants'

import { QueryParamObjectType, RowCounterType } from './types'

export function getExpectedUrlWithQueryParams({
  url,
  queryParamsList,
  serialize,
}: {
  url: string
  queryParamsList?: QueryParamObjectType[]
  serialize?: (value: string) => string
}): { expectedUrl: URL; params: URLSearchParams } {
  const expectedUrl = new URL(url)
  const params = expectedUrl.searchParams
  if (!queryParamsList) {
    return { expectedUrl, params }
  }

  queryParamsList.forEach(({ queryParamKey, queryParamValue }) => {
    if (queryParamKey) {
      params.append(
        queryParamKey,
        serialize ? serialize(queryParamValue) : queryParamValue,
      )
    }
  })
  return { expectedUrl, params: expectedUrl.searchParams }
}

export function getExpectedFilterCount({
  browseDatasetsData,
  singleDatasetData,
  singleRunData,
}: {
  browseDatasetsData?: GetDatasetsDataQuery
  singleDatasetData?: GetDatasetByIdQuery
  singleRunData?: GetRunByIdV2Query
}) {
  return (
    browseDatasetsData?.filtered_datasets_aggregate.aggregate?.count ??
    singleDatasetData?.datasets.at(0)?.filtered_runs_count.aggregate?.count ??
    singleRunData?.numFilteredAnnotationRows.aggregate?.[0].count ??
    0
  )
}

export function getExpectedTotalCount({
  browseDatasetsData,
  singleDatasetData,
  singleRunData,
}: {
  browseDatasetsData?: GetDatasetsDataQuery
  singleDatasetData?: GetDatasetByIdQuery
  singleRunData?: GetRunByIdV2Query
}) {
  return (
    browseDatasetsData?.datasets_aggregate.aggregate?.count ??
    singleDatasetData?.datasets.at(0)?.runs_aggregate.aggregate?.count ??
    singleRunData?.numTotalAnnotationRows.aggregate?.[0].count ??
    0
  )
}

// #Region runPage
export function getAnnotationRowCountFromData({
  singleRunData,
}: {
  singleRunData: GetRunByIdV2Query
}): RowCounterType {
  const rowCounter: RowCounterType = {}
  for (const shape of singleRunData.annotationShapes) {
    if (rowCounter[shape.annotation!.id] === undefined) {
      rowCounter[shape.annotation!.id] = 1
    } else {
      rowCounter[shape.annotation!.id] += 1
    }
  }
  return rowCounter
}
// #endregion runPage

// #region datasetPage
export function getRunIdCountsFromData({
  singleDatasetData,
}: {
  singleDatasetData: GetDatasetByIdQuery
}) {
  const rowCounter: RowCounterType = {}
  singleDatasetData.datasets
    .at(0)
    ?.runs.map((run) => run.id)
    .reduce((counter, id) => {
      counter[id] = (counter[id] || 0) + 1
      return counter
    }, rowCounter)
  return rowCounter
}
// #endregion singleDatasetPage

// #region browseDatasetsPage
export function getDatasetIdCountsFromData({
  browseDatasetsData,
}: {
  browseDatasetsData: GetDatasetsDataQuery
}) {
  const rowCounter: RowCounterType = {}
  browseDatasetsData.datasets
    .map((dataset) => dataset.id)
    .reduce((counter, id) => {
      counter[id] = (counter[id] || 0) + 1
      return counter
    }, rowCounter)
  return rowCounter
}

export const serializeAvailableFiles = (value: string): string => {
  return (
    Object.entries(AVAILABLE_FILES_VALUE_TO_I18N_MAP).find(
      ([, i18nKey]) =>
        translations[i18nKey as keyof typeof translations] === value,
    )?.[0] ?? value
  )
}

export function getFilteredOrganismNamesFromData({
  datasetsFilterData,
  testQuery,
}: {
  datasetsFilterData: GetDatasetsFilterDataQuery
  testQuery: string
}) {
  const organismNames = datasetsFilterData.organism_names
    .map((name) => name.organism_name)
    .filter(isString)

  return organismNames.filter((name) => name.toLowerCase().includes(testQuery))
}

// #endregion browseDatasetsPage
