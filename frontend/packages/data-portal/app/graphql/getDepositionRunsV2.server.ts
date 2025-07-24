/**
 * Pull run info pertaining to a specific deposition, either in annotation or tomogram flavor.
 *
 * 3 types of pull here
 * 1. Pulling counts of runs (either anno or tomo flavor) for the deposition
 * 2. Paging through the deposition runs (anno or tomo) for a specific dataset
 * 3. Getting all the annos/tomos of a deposition for a specific run
 *
 * Each of the above pull types will need a variant for each flavor, doing annotation or
 * tomogram version. I'm running out of time, so I'm just going to flesh out anno flavor
 * of each, but the tomo flavor should be extremely similar.
 *
 * --- Pull 1 ---
 * Getting the count of runs for a deposition is a two-step process.
 * 1. Pull the ids for all datasets associated with the deposition (for either anno or tomo flavor).
 * 2. Get the count of runs where they belong to one of above datasets and the deposition
 * I believe this is necessary due to how the GraphQL resolves, we can't just do it in a single
 * query. But because we already have to get all the dataset info to be able to populate the
 * dataset filter, we have #1 on hand, and we only need the info from #2 if the user clicks into
 * the "Group By" for Deposited Location (to show the # Runs in an unexpanded dataset accordion).
 * [In retrospect, I'm not totally sure why the `datasetIds` is necessary to use for an _in filter,
 * maybe you could just groupBy from the beginning. But I recall there being some issue with trying
 * to go directly to it, so I'm leaving it like that. Sorry I don't have more time to explore!]
 *
 * There is no pagination on counting, because we have a core assumption of the number of datasets
 * never being so big it forces paging of top-level dataset info.
 *
 * --- Pull 2 ---
 * Pull all the runs (either anno or tomo flavor) for a specific dataset that also
 * belong to the deposition of interest. We don't want _all_ the runs in the dataset,
 * we just want those that belong to deposition and are inside the dataset. Provides
 * pagination because we can have very large numbers of runs in some cases.
 */
import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  GetDepositionAnnoRunCountsForDatasetsQuery,
  GetDepositionAnnoRunsForDatasetQuery,
 } from 'app/__generated_v2__/graphql'

 import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'


// Annotation flavor -- TODO create a tomogram flavor as well
const GET_DEPOSITION_ANNO_RUN_COUNTS_FOR_DATASETS = gql(`
  query GetDepositionAnnoRunCountsForDatasets(
    $depositionId: Int!,
    $datasetIds: [Int!]!,
  ) {
    runsAggregate(
      where: {
        annotations: {depositionId: {_eq: $depositionId}}
        datasetId: {_in: $datasetIds},
      }
    ) {
      aggregate {
        count(columns: id)
        groupBy {
          dataset {
            id
          }
        }
      }
    }
  }
`)

// Annotation flavor -- TODO create a tomogram flavor as well
const GET_DEPOSiTION_ANNO_RUNS_FOR_DATASET = gql(`
  query GetDepositionAnnoRunsForDataset(
    $depositionId: Int!,
    $datasetId: Int!,
    $limit: Int!,
    $offset: Int!
  ) {
    runs(
      where: {
        datasetId: {_eq: $datasetId},
        annotations: {depositionId: {_eq: $depositionId}}
      },
      orderBy: [{name: asc}],
      limitOffset: {limit: $limit, offset: $offset}
    ) {
      id
      name

      # Get annotation count for each run
      annotationsAggregate(where: {depositionId: {_eq: $depositionId}}) {
        aggregate {
          count
        }
      }
    }

    # Count of ALL matching runs (not just this page) to show "1-10 of 78 Runs", etc
    runsAggregate(
      where: {
        datasetId: {_eq: $datasetId},
        annotations: {depositionId: {_eq: $depositionId}}
      }
    ) {
      aggregate {
        count
      }
    }
  }
`)

export async function getDepositionAnnoRunCountsForDatasets({
  client,
  depositionId,
  datasetIds,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  datasetIds: number[]
}): Promise<ApolloQueryResult<GetDepositionAnnoRunCountsForDatasetsQuery>> {
  return client.query({
    query: GET_DEPOSITION_ANNO_RUN_COUNTS_FOR_DATASETS,
    variables: {
      depositionId,
      datasetIds,
    }
  })
}

export async function getDepositionAnnoRunsForDataset({
  client,
  depositionId,
  datasetId,
  page,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  datasetId: number
  page: number
}): Promise<ApolloQueryResult<GetDepositionAnnoRunsForDatasetQuery>> {
  return client.query({
    query: GET_DEPOSiTION_ANNO_RUNS_FOR_DATASET,
    variables: {
      depositionId,
      datasetId,
      limit: MAX_PER_ACCORDION_GROUP,
      offset: (page - 1) * MAX_PER_ACCORDION_GROUP,
    }
  })
}
