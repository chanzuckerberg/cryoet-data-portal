import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  GetDatasetIdsByAlignmentDepositionV2Query,
  GetDatasetIdsByAnnotationDepositionV2Query,
  GetDatasetIdsByDepositionV2Query,
  GetDatasetIdsByTomogramDepositionV2Query,
} from 'app/__generated_v2__/graphql'

// Query to get dataset IDs that have a direct deposition match
const GET_DATASET_IDS_BY_DEPOSITION = gql(`
  query GetDatasetIdsByDepositionV2($depositionId: Int!) {
    datasets(where: { depositionId: { _eq: $depositionId } }) {
      id
    }
  }
`)

// Query to get dataset IDs that have runs with annotations from the specified deposition
const GET_DATASET_IDS_BY_ANNOTATION_DEPOSITION = gql(`
  query GetDatasetIdsByAnnotationDepositionV2($depositionId: Int!) {
    datasets(
      where: {
        runsAggregate: {
          count: {
            filter: {
              annotationsAggregate: {
                count: {
                  filter: { depositionId: { _eq: $depositionId } }
                  predicate: { _gt: 0 }
                }
              }
            }
            predicate: { _gt: 0 }
          }
        }
      }
    ) {
      id
    }
  }
`)

// Query to get dataset IDs that have runs with tomograms from the specified deposition
const GET_DATASET_IDS_BY_TOMOGRAM_DEPOSITION = gql(`
  query GetDatasetIdsByTomogramDepositionV2($depositionId: Int!) {
    datasets(
      where: {
        runsAggregate: {
          count: {
            filter: {
              tomogramsAggregate: {
                count: {
                  filter: { depositionId: { _eq: $depositionId } }
                  predicate: { _gt: 0 }
                }
              }
            }
            predicate: { _gt: 0 }
          }
        }
      }
    ) {
      id
    }
  }
`)

// Query to get dataset IDs that have runs with alignments from the specified deposition
const GET_DATASET_IDS_BY_ALIGNMENT_DEPOSITION = gql(`
  query GetDatasetIdsByAlignmentDepositionV2($depositionId: Int!) {
    datasets(
      where: {
        runsAggregate: {
          count: {
            filter: {
              alignmentsAggregate: {
                count: {
                  filter: { depositionId: { _eq: $depositionId } }
                  predicate: { _gt: 0 }
                }
              }
            }
            predicate: { _gt: 0 }
          }
        }
      }
    ) {
      id
    }
  }
`)

async function getDatasetIdsByDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetIdsByDepositionV2Query>> {
  return client.query({
    query: GET_DATASET_IDS_BY_DEPOSITION,
    variables: { depositionId },
  })
}

async function getDatasetIdsByAnnotationDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetIdsByAnnotationDepositionV2Query>> {
  return client.query({
    query: GET_DATASET_IDS_BY_ANNOTATION_DEPOSITION,
    variables: { depositionId },
  })
}

async function getDatasetIdsByTomogramDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetIdsByTomogramDepositionV2Query>> {
  return client.query({
    query: GET_DATASET_IDS_BY_TOMOGRAM_DEPOSITION,
    variables: { depositionId },
  })
}

async function getDatasetIdsByAlignmentDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<ApolloQueryResult<GetDatasetIdsByAlignmentDepositionV2Query>> {
  return client.query({
    query: GET_DATASET_IDS_BY_ALIGNMENT_DEPOSITION,
    variables: { depositionId },
  })
}

/**
 * Aggregates dataset IDs from all deposition-related queries.
 * Returns a deduplicated array of dataset IDs that have content
 * (annotations, tomograms, alignments, or direct dataset) from the specified deposition.
 */
export async function getAggregatedDatasetIdsByDeposition({
  depositionId,
  client,
}: {
  depositionId: number
  client: ApolloClient<NormalizedCacheObject>
}): Promise<number[]> {
  // Execute all queries in parallel for efficiency
  const [directResult, annotationResult, tomogramResult, alignmentResult] =
    await Promise.all([
      getDatasetIdsByDeposition({ depositionId, client }),
      getDatasetIdsByAnnotationDeposition({ depositionId, client }),
      getDatasetIdsByTomogramDeposition({ depositionId, client }),
      getDatasetIdsByAlignmentDeposition({ depositionId, client }),
    ])

  // Collect all dataset IDs
  const allDatasetIds = new Set<number>([
    ...(directResult.data?.datasets?.map((dataset) => dataset.id) || []),
    ...(annotationResult.data?.datasets?.map((dataset) => dataset.id) || []),
    ...(tomogramResult.data?.datasets?.map((dataset) => dataset.id) || []),
    ...(alignmentResult.data?.datasets?.map((dataset) => dataset.id) || []),
  ])

  // Return as sorted array for consistent ordering
  return Array.from(allDatasetIds).sort((a, b) => a - b)
}
