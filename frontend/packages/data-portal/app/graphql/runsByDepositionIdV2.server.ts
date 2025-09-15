import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  GetRunIdsByAlignmentDepositionV2Query,
  GetRunIdsByAnnotationDepositionV2Query,
  GetRunIdsByTomogramDepositionV2Query,
  GetRunIdsForDatasetDepositionV2Query,
} from 'app/__generated_v2__/graphql'

// Query to get run IDs from datasets that have the specified deposition ID
const GET_RUN_IDS_FOR_DATASET_DEPOSITION = gql(`
  query GetRunIdsForDatasetDepositionV2($depositionId: Int!) {
    runs(where: { dataset: { depositionId: { _eq: $depositionId } } }) {
      id
    }
  }
`)

// Query to get run IDs that have annotations from the specified deposition
const GET_RUN_IDS_BY_ANNOTATION_DEPOSITION = gql(`
  query GetRunIdsByAnnotationDepositionV2($depositionId: Int!) {
    runs(
      where: {
        annotationsAggregate: {
          count: {
            filter: { depositionId: { _eq: $depositionId } }
            predicate: { _gt: 0 }
          }
        }
      }
    ) {
      id
    }
  }
`)

// Query to get run IDs that have tomograms from the specified deposition
const GET_RUN_IDS_BY_TOMOGRAM_DEPOSITION = gql(`
  query GetRunIdsByTomogramDepositionV2($depositionId: Int!) {
    runs(
      where: {
        tomogramsAggregate: {
          count: {
            filter: { depositionId: { _eq: $depositionId } }
            predicate: { _gt: 0 }
          }
        }
      }
    ) {
      id
    }
  }
`)

// Query to get run IDs that have alignments from the specified deposition
const GET_RUN_IDS_BY_ALIGNMENT_DEPOSITION = gql(`
  query GetRunIdsByAlignmentDepositionV2($depositionId: Int!) {
    runs(
      where: {
        alignmentsAggregate: {
          count: {
            filter: { depositionId: { _eq: $depositionId } }
            predicate: { _gt: 0 }
          }
        }
      }
    ) {
      id
    }
  }
`)

async function getRunIdsForDatasetDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetRunIdsForDatasetDepositionV2Query>> {
  return client.query({
    query: GET_RUN_IDS_FOR_DATASET_DEPOSITION,
    variables: { depositionId },
  })
}

async function getRunIdsByAnnotationDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetRunIdsByAnnotationDepositionV2Query>> {
  return client.query({
    query: GET_RUN_IDS_BY_ANNOTATION_DEPOSITION,
    variables: { depositionId },
  })
}

async function getRunIdsByTomogramDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetRunIdsByTomogramDepositionV2Query>> {
  return client.query({
    query: GET_RUN_IDS_BY_TOMOGRAM_DEPOSITION,
    variables: { depositionId },
  })
}

async function getRunIdsByAlignmentDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetRunIdsByAlignmentDepositionV2Query>> {
  return client.query({
    query: GET_RUN_IDS_BY_ALIGNMENT_DEPOSITION,
    variables: { depositionId },
  })
}

/**
 * Aggregates run IDs from all deposition-related queries.
 * Returns a deduplicated array of run IDs that have content
 * (annotations, tomograms, alignments, or from datasets with deposition ID) from the specified deposition.
 *
 * PERFORMANCE IMPLICATIONS: This function performs multiple database queries (up to 4 parallel queries)
 * which can be expensive. This is a temporary workaround to simulate OR operator functionality
 * that is not currently supported by the backend GraphQL schema.
 *
 * TODO: Remove this workaround once backend OR operator support is available and replace
 * with a single optimized query.
 */
export async function getAggregatedRunIdsByDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<number[]> {
  // Execute all queries in parallel for efficiency
  const [datasetResult, annotationResult, tomogramResult, alignmentResult] =
    await Promise.all([
      getRunIdsForDatasetDeposition({ depositionId, client }),
      getRunIdsByAnnotationDeposition({ depositionId, client }),
      getRunIdsByTomogramDeposition({ depositionId, client }),
      getRunIdsByAlignmentDeposition({ depositionId, client }),
    ])

  // Collect all run IDs
  const allRunIds = new Set<number>([
    ...(datasetResult.data?.runs?.map((run) => run.id) || []),
    ...(annotationResult.data?.runs?.map((run) => run.id) || []),
    ...(tomogramResult.data?.runs?.map((run) => run.id) || []),
    ...(alignmentResult.data?.runs?.map((run) => run.id) || []),
  ])

  // Return as sorted array for consistent ordering
  return Array.from(allRunIds).sort((a, b) => a - b)
}
