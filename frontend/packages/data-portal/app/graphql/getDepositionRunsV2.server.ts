/**
 * Pull run info pertaining to a specific deposition, either in annotation or tomogram flavor.
 *
 * Getting the count of runs for a deposition is a two-step process.
 * 1. Pull the ids for all datasets associated with the deposition (for either anno or tomo flavor).
 * 2. Get the count of runs where they belong to one of above datasets and the deposition
 * I believe this is necessary due to how the GraphQL resolves, we can't just do it in a single
 * query. But because we already have to get all the dataset info to be able to populate the
 * dataset filter, we have #1 on hand, and we only need the info from #2 if the user clicks into
 * the "Group By" for Deposited Location (to show the # Runs in an unexpanded dataset accordion).
 *
 * There is no pagination on counting, because we have a core assumption of the number of datasets
 * never being so big it forces paging of top-level dataset info.
 */
import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import { GetDepositionAnnoRunsForDatasetsQuery } from 'app/__generated_v2__/graphql'


const GET_DEPOSITION_ANNO_RUNS_FOR_DATASETS = gql(`
  query GetDepositionAnnoRunsForDatasets(
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

export async function getDepositionAnnoRunsForDatasets({
  client,
  depositionId,
  datasetIds,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  datasetIds: number[]
}): Promise<ApolloQueryResult<GetDepositionAnnoRunsForDatasetsQuery>> {
  return client.query({
    query: GET_DEPOSITION_ANNO_RUNS_FOR_DATASETS,
    variables: {
      depositionId,
      datasetIds,
    }
  })
}