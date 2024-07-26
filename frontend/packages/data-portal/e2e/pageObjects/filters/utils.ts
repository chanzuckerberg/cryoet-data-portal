import { translations } from 'e2e/constants'
import { isString } from 'lodash-es'

import {
  GetDatasetByIdQuery,
  GetDatasetsDataQuery,
  GetRunByIdQuery,
} from 'app/__generated__/graphql'
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
  singleRunData?: GetRunByIdQuery
}) {
  return (
    browseDatasetsData?.filtered_datasets_aggregate.aggregate?.count ??
    singleDatasetData?.datasets.at(0)?.filtered_runs_count.aggregate?.count ??
    singleRunData?.runs.at(0)?.tomogram_stats.at(0)?.filtered_annotations_count
      .aggregate?.count ??
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
  singleRunData?: GetRunByIdQuery
}) {
  return (
    browseDatasetsData?.datasets_aggregate.aggregate?.count ??
    singleDatasetData?.datasets.at(0)?.runs_aggregate.aggregate?.count ??
    singleRunData?.runs.at(0)?.tomogram_stats.at(0)?.annotations_aggregate
      .aggregate?.count ??
    0
  )
}

// #Region runPage
export function getAnnotationRowCountFromData({
  singleRunData,
}: {
  singleRunData: GetRunByIdQuery
}): RowCounterType {
  const rowCounter: RowCounterType = {}
  singleRunData.runs
    .at(0)
    ?.annotation_table.at(0)
    ?.annotations.reduce((counter, annotation) => {
      const objectShapeTypes = new Set()
      for (const file of annotation.files) {
        objectShapeTypes.add(file.shape_type)
      }
      counter[annotation.id] = objectShapeTypes.size
      return counter
    }, rowCounter)
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
  browseDatasetsData,
  testQuery,
}: {
  browseDatasetsData: GetDatasetsDataQuery
  testQuery: string
}) {
  const organismNames = browseDatasetsData.organism_names
    .map((name) => name.organism_name)
    .filter(isString)

  return organismNames.filter((name) => name.toLowerCase().includes(testQuery))
}

// #endregion browseDatasetsPage
