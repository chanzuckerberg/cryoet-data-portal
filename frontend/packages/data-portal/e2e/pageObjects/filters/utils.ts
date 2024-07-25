import {
  GetDatasetByIdQuery,
  GetDatasetsDataQuery,
  GetRunByIdQuery,
} from 'app/__generated__/graphql'
import { QueryParams } from 'app/constants/query'

import { RowCounterType } from './types'

export function getExpectedUrlWithQueryParams({
  url,
  queryParamKey,
  queryParamValue,
  serialize,
}: {
  url: string
  queryParamKey?: QueryParams
  queryParamValue: string
  serialize?: (value: string) => string
}): { expectedUrl: URL; params: URLSearchParams } {
  const expectedUrl = new URL(url)
  const params = expectedUrl.searchParams
  if (queryParamKey) {
    params.set(
      queryParamKey,
      serialize ? serialize(queryParamValue) : queryParamValue,
    )
  }
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

// #endregion browseDatasetsPage
