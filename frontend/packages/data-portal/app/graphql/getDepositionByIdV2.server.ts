import {
  type ApolloClient,
  type ApolloQueryResult,
  type NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  GetDepositionBaseDataV2Query,
  GetDepositionExpandedDataV2Query,
  GetDepositionLegacyDataV2Query,
  OrderBy,
} from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { getFilterState } from 'app/hooks/useFilter'

import {
  getDatasetsFilter,
  getDepositionAnnotationsCountFilter,
  getDepositionTomogramsFilter,
} from './common'

// Base query - always fetched, contains core deposition data and counts
const GET_DEPOSITION_BASE_DATA = gql(`
  query GetDepositionBaseDataV2(
    $id: Int!,
    $filteredAnnotationsFilter: AnnotationWhereClause!,
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
      annotationMethodAndMethodLinksCombinations: annotationsAggregate {
        aggregate {
          count
          groupBy {
            annotationMethod
            annotationSoftware
            methodType
            methodLinks {
              link
              linkType
              name
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

    annotationsCount: annotationsAggregate(where: {
      depositionId: {
        _eq: $id
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

    filteredAnnotationsCount: annotationsAggregate(where: $filteredAnnotationsFilter) {
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

// Legacy query - only when isExpandDepositions === false, contains datasets and aggregates for DatasetsTable
const GET_DEPOSITION_LEGACY_DATA = gql(`
  query GetDepositionLegacyDataV2(
    $datasetsLimit: Int!,
    $datasetsOffset: Int!,
    $datasetsOrderBy: [DatasetOrderByClause!],
    $datasetsFilter: DatasetWhereClause!,
    $datasetsByDepositionFilter: DatasetWhereClause!,
    $tiltseriesByDepositionFilter: TiltseriesWhereClause!,
    $tomogramsByDepositionFilter: TomogramWhereClause!,
    $annotationsByDepositionFilter: AnnotationWhereClause!,
    $annotationShapesByDepositionFilter: AnnotationShapeWhereClause!
  ) {
    # Datasets:
    # This section is very similar to the datasets page.
    datasets(
      where: $datasetsFilter
      orderBy: $datasetsOrderBy,
      limitOffset: {
        limit: $datasetsLimit,
        offset: $datasetsOffset
      }
    ) {
      id
      title
      organismName
      keyPhotoThumbnailUrl
      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            name
            primaryAuthorStatus
            correspondingAuthorStatus
          }
        }
      }
      runsCount: runsAggregate(where: { annotations: $annotationsByDepositionFilter }) {
        aggregate {
          count
        }
      }
      runs {
        edges {
          node {
            annotationsAggregate(where: $annotationsByDepositionFilter) {
              aggregate {
                count
                groupBy {
                  objectName
                  groundTruthStatus
                }
              }
            }
          }
        }
      }
    }

    ...DatasetsAggregates
  }
`)

// Expanded query - only when isExpandDepositions === true, contains allRuns for DepositionFilters
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

  const filteredAnnotationsFilter = getDepositionAnnotationsCountFilter({
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

// Legacy data function - for datasets table and filters when isExpandDepositions === false
export async function getDepositionLegacyData({
  client,
  id,
  orderBy,
  page,
  params,
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: OrderBy
  id: number
  page: number
  params: URLSearchParams
}): Promise<ApolloQueryResult<GetDepositionLegacyDataV2Query>> {
  const depositionIdFilter = {
    depositionId: {
      _eq: id,
    },
  }

  return client.query({
    query: GET_DEPOSITION_LEGACY_DATA,
    variables: {
      datasetsLimit: MAX_PER_PAGE,
      datasetsOffset: (page - 1) * MAX_PER_PAGE,
      datasetsOrderBy: orderBy !== undefined ? [{ title: orderBy }] : [],
      datasetsFilter: getDatasetsFilter({
        filterState: getFilterState(params),
        depositionId: id,
      }),
      datasetsByDepositionFilter: {
        runs: {
          annotations: depositionIdFilter,
        },
      },
      tiltseriesByDepositionFilter: depositionIdFilter,
      tomogramsByDepositionFilter: depositionIdFilter,
      annotationsByDepositionFilter: depositionIdFilter,
      annotationShapesByDepositionFilter: {
        annotation: depositionIdFilter,
      },
    },
  })
}

// Expanded data function - for allRuns when isExpandDepositions === true
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
