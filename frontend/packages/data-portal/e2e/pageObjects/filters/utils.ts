import { ApolloQueryResult } from '@apollo/client'
import { E2E_CONFIG } from 'e2e/constants'

import {
  GetDatasetByIdQuery,
  GetDatasetsDataQuery,
  GetRunByIdQuery,
} from 'app/__generated__/graphql'
import { QueryParams } from 'app/constants/query'
import { getRunById } from 'app/graphql/getRunById.server'

import { AnnotationRowCounter, TableValidatorOptions } from './types'

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

// #Region singleRunPage
export async function getAnnotationsTableTestData({
  client,
  params,
  pageNumber,
  id = +E2E_CONFIG.runId,
}: TableValidatorOptions & { id?: number }): Promise<
  ApolloQueryResult<GetRunByIdQuery>['data']
> {
  const { data } = await getRunById({
    client,
    params,
    id,
    page: pageNumber,
  })

  return data
}

export function getAnnotationRowCountFromData({
  singleRunData,
}: {
  singleRunData: GetRunByIdQuery
}) {
  const rowCounter: AnnotationRowCounter = {}
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
// #endregion singleRunPage

// #region singleDatasetPage

// #endregion singleDatasetPage