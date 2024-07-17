import { ApolloQueryResult } from '@apollo/client'
import { E2E_CONFIG } from 'e2e/constants'

import {
  GetDatasetByIdQuery,
  GetDatasetsDataQuery,
  GetRunByIdQuery,
} from 'app/__generated__/graphql'
import { QueryParams } from 'app/constants/query'
import { getRunById } from 'app/graphql/getRunById.server'

import { TableValidatorOptions } from './types'

export function getExpectedUrlWithQueryParams({
  url,
  queryParam,
  value,
  serialize,
}: {
  url: string
  queryParam?: QueryParams
  value: string
  serialize?: (value: string) => string
}): { expectedUrl: URL; params: URLSearchParams } {
  const expectedUrl = new URL(url)
  const params = expectedUrl.searchParams
  if (queryParam) {
    params.set(queryParam, serialize ? serialize(value) : value)
  }
  return { expectedUrl, params: expectedUrl.searchParams }
}

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

export function getAnnotationIdsFromData({
  singleRunData,
}: {
  singleRunData: GetRunByIdQuery
}) {
  console.log(JSON.stringify(singleRunData))
  return singleRunData.runs
    .at(0)
    ?.annotation_table.at(0)
    ?.annotations.map((annotation) => annotation.id)
}
