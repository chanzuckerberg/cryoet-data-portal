import {
  type ApolloClient,
  type ApolloQueryResult,
  type NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  GetDepositionBaseDataV2Query,
  GetDepositionExpandedDataV2Query,
} from 'app/__generated_v2__/graphql'
import { getFilterState } from 'app/hooks/useFilter'

import {
  getDepositionAnnotationsFilter,
  getDepositionTomogramsFilter,
} from './common'

// Base query - always fetched, contains core deposition data and counts
const GET_DEPOSITION_BASE_DATA = gql(`
  query GetDepositionBaseDataV2(
    $id: Int!,
    $filteredAnnotationsFilter: AnnotationShapeWhereClause!,
    $filteredTomogramsFilter: TomogramWhereClause!
  ) {
    # Deposition:
    depositions(where: { id: { _eq: $id }}) {
      depositionDate
      depositionPublications
      description
      id
      keyPhotoUrl
      lastModifiedDate
      relatedDatabaseEntries
      releaseDate
      title
      tag
      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            correspondingAuthorStatus
            email
            name
            orcid
            kaggleId
            primaryAuthorStatus
          }
        }
      }
      annotationsAggregate {
        aggregate {
          count

          groupBy {
            run {
              dataset {
                id
              }
            }
          }
        }
      }
      annotationMethodCounts: annotationsAggregate {
        aggregate {
          count
          groupBy {
            annotationMethod
          }
        }
      }

      annotations(where: {depositionId: {_eq: $id}}) {
        edges {
          node {
            annotationMethod
            annotationSoftware
            methodType
            methodLinks {
              edges {
                node {
                  id
                  link
                  linkType
                  name
                }
              }
            }
          }
        }
      }

      tomogramMethodCounts: tomogramsAggregate(where: { depositionId: { _eq: $id } }) {
        aggregate {
          count
          groupBy {
            voxelSpacing
            reconstructionMethod
            processing
            ctfCorrected
          }
        }
      }

      acquisitionMethodCounts: tiltseriesAggregate(where: { depositionId: { _eq: $id } }) {
        aggregate {
          count
          groupBy {
            microscopeModel
            cameraModel
            tiltingScheme
            pixelSpacing
            microscopeEnergyFilter
            microscopePhasePlate
          }
        }
      }

    }

    experimentalConditionsCounts: runsAggregate(where: { annotations: { depositionId: { _eq: $id } } }) {
      aggregate {
        count
        groupBy {
          dataset {
            samplePreparation
            sampleType
            gridPreparation
          }
        }
      }
    }

    annotationsCount: annotationShapesAggregate(where: {
      annotation: {
        depositionId: {
          _eq: $id
        }
      }
    }) {
      aggregate {
        count
      }
    }

    tomogramsCount: tomogramsAggregate(where: {
      depositionId: {
        _eq: $id
      }
    }) {
      aggregate {
        count
      }
    }

    filteredAnnotationsCount: annotationShapesAggregate(where: $filteredAnnotationsFilter) {
      aggregate {
        count
      }
    }

    filteredTomogramsCount: tomogramsAggregate(where: $filteredTomogramsFilter) {
      aggregate {
        count
      }
    }
  }
`)

// Query for allRuns data used in DepositionFilters
const GET_DEPOSITION_EXPANDED_DATA = gql(`
  query GetDepositionExpandedDataV2($id: Int!) {
    allRuns: runs(where: {
      annotations: {
        depositionId: { _eq: $id }
      }
    }) {
      ...DataContents
    }
  }
`)

// Base data function - simplified to only fetch core deposition info and counts
export async function getDepositionBaseData({
  client,
  id,
  params = new URLSearchParams(),
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  params?: URLSearchParams
}): Promise<ApolloQueryResult<GetDepositionBaseDataV2Query>> {
  const filterState = getFilterState(params)
  const datasetIds = filterState.ids.datasets
    .map((datasetId) => parseInt(datasetId))
    .filter((datasetId) => Number.isInteger(datasetId))
  const { organismNames } = filterState.sampleAndExperimentConditions

  const filteredAnnotationsFilter = getDepositionAnnotationsFilter({
    depositionId: id,
    datasetIds: datasetIds.length > 0 ? datasetIds : undefined,
    organismNames: organismNames.length > 0 ? organismNames : undefined,
  })

  const filteredTomogramsFilter = getDepositionTomogramsFilter({
    depositionId: id,
    datasetIds: datasetIds.length > 0 ? datasetIds : undefined,
    organismNames: organismNames.length > 0 ? organismNames : undefined,
  })

  return client.query({
    query: GET_DEPOSITION_BASE_DATA,
    variables: {
      id,
      filteredAnnotationsFilter,
      filteredTomogramsFilter,
    },
  })
}

// Data function for allRuns used in DepositionFilters
export async function getDepositionExpandedData({
  client,
  id,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
}): Promise<ApolloQueryResult<GetDepositionExpandedDataV2Query>> {
  return client.query({
    query: GET_DEPOSITION_EXPANDED_DATA,
    variables: {
      id,
    },
  })
}
