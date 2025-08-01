import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  GetAnnotationsForRunAndDepositionQuery,
  GetDepositionAnnoRunCountsForDatasetsQuery,
  GetDepositionAnnoRunsForDatasetQuery,
  GetDepositionTomoRunCountsForDatasetsQuery,
  GetDepositionTomoRunsForDatasetQuery,
  GetTomogramsForRunAndDepositionQuery,
} from 'app/__generated_v2__/graphql'
import {
  MAX_PER_ACCORDION_GROUP,
  MAX_PER_FULLY_OPEN_ACCORDION,
} from 'app/constants/pagination'

// Annotation flavor
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

// Annotation flavor
const GET_DEPOSITION_ANNO_RUNS_FOR_DATASET = gql(`
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

// Annotation flavor
// This query is very similar to GET_DEPOSITION_ANNOTATIONS_FOR_DATASETS elsewhere,
// it's just that we filter based on deposition+run rather than deposition+datasets.
const GET_ANNOTATIONS_FOR_RUN_AND_DEPOSITION = gql(`
  query GetAnnotationsForRunAndDeposition(
    $depositionId: Int!,
    $runId: Int!,
    $limit: Int!,
    $offset: Int!,
  ) {
    annotationShapes(
      where: {
        annotation: {
          depositionId: {
            _eq: $depositionId
          },
          runId: {
            _eq: $runId
          },
        },
      },
      limitOffset: {
        limit: $limit,
        offset: $offset,
      },
      orderBy: [
        {
          annotation: {
            groundTruthStatus: desc
          }
        },
        {
          annotation: {
            depositionDate: desc
          }
        },
        {
          annotation: {
            id: desc
          }
        }
      ]
    ) {
      id
      shapeType

      annotation {
        groundTruthStatus
        id
        methodType
        objectName

        run {
          id
          name

          dataset {
            id
            title
          }
        }
      }

      annotationFiles(first: 1) {
        edges {
          node {
            s3Path
          }
        }
      }
    }

    # Count of ALL matching annos (not just this page) to show "1-5 of 52 Annotations", etc
    annotationShapesAggregate(
      where: {
        annotation: {
          depositionId: {_eq: $depositionId}
          runId: {_eq: $runId},
        }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`)

// Tomogram flavor -- equivalent to annotation queries above
const GET_DEPOSITION_TOMO_RUN_COUNTS_FOR_DATASETS = gql(`
  query GetDepositionTomoRunCountsForDatasets(
    $depositionId: Int!,
    $datasetIds: [Int!]!,
  ) {
    runsAggregate(
      where: {
        tomograms: {depositionId: {_eq: $depositionId}}
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

// Tomogram flavor -- equivalent to annotation query above
const GET_DEPOSITION_TOMO_RUNS_FOR_DATASET = gql(`
  query GetDepositionTomoRunsForDataset(
    $depositionId: Int!,
    $datasetId: Int!,
    $limit: Int!,
    $offset: Int!
  ) {
    runs(
      where: {
        datasetId: {_eq: $datasetId},
        tomograms: {depositionId: {_eq: $depositionId}}
      },
      orderBy: [{name: asc}],
      limitOffset: {limit: $limit, offset: $offset}
    ) {
      id
      name

      # Get tomogram count for each run
      tomogramsAggregate(where: {depositionId: {_eq: $depositionId}}) {
        aggregate {
          count
        }
      }
    }

    # Count of ALL matching runs (not just this page) to show "1-10 of 78 Runs", etc
    runsAggregate(
      where: {
        datasetId: {_eq: $datasetId},
        tomograms: {depositionId: {_eq: $depositionId}}
      }
    ) {
      aggregate {
        count
      }
    }
  }
`)

// Tomogram flavor -- equivalent to annotation query above
const GET_TOMOGRAMS_FOR_RUN_AND_DEPOSITION = gql(`
  query GetTomogramsForRunAndDeposition(
    $depositionId: Int!,
    $runId: Int!,
    $limit: Int!,
    $offset: Int!,
  ) {
    tomograms(
      where: {
        depositionId: {_eq: $depositionId},
        run: {id: {_eq: $runId}},
      },
      limitOffset: {
        limit: $limit,
        offset: $offset,
      },
      orderBy: [
        {depositionDate: desc},
        {id: desc}
      ]
    ) {
      id
      name
      voxelSpacing
      reconstructionMethod
      reconstructionSoftware
      processing
      ctfCorrected
      fiducialAlignmentStatus
      keyPhotoThumbnailUrl
      keyPhotoUrl

      run {
        id
        name

        dataset {
          id
          title
        }
      }
    }

    # Count of ALL matching tomograms (not just this page) to show "1-5 of 52 Tomograms", etc
    tomogramsAggregate(
      where: {
        depositionId: {_eq: $depositionId}
        run: {id: {_eq: $runId}},
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
    },
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
    query: GET_DEPOSITION_ANNO_RUNS_FOR_DATASET,
    variables: {
      depositionId,
      datasetId,
      limit: MAX_PER_ACCORDION_GROUP,
      offset: (page - 1) * MAX_PER_ACCORDION_GROUP,
    },
  })
}

export async function getAnnotationsForRunAndDeposition({
  client,
  depositionId,
  runId,
  page,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  runId: number
  page: number
}): Promise<ApolloQueryResult<GetAnnotationsForRunAndDepositionQuery>> {
  return client.query({
    query: GET_ANNOTATIONS_FOR_RUN_AND_DEPOSITION,
    variables: {
      depositionId,
      runId,
      limit: MAX_PER_FULLY_OPEN_ACCORDION,
      offset: (page - 1) * MAX_PER_FULLY_OPEN_ACCORDION,
    },
  })
}

export async function getDepositionTomoRunCountsForDatasets({
  client,
  depositionId,
  datasetIds,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  datasetIds: number[]
}): Promise<ApolloQueryResult<GetDepositionTomoRunCountsForDatasetsQuery>> {
  return client.query({
    query: GET_DEPOSITION_TOMO_RUN_COUNTS_FOR_DATASETS,
    variables: {
      depositionId,
      datasetIds,
    },
  })
}

export async function getDepositionTomoRunsForDataset({
  client,
  depositionId,
  datasetId,
  page,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  datasetId: number
  page: number
}): Promise<ApolloQueryResult<GetDepositionTomoRunsForDatasetQuery>> {
  return client.query({
    query: GET_DEPOSITION_TOMO_RUNS_FOR_DATASET,
    variables: {
      depositionId,
      datasetId,
      limit: MAX_PER_ACCORDION_GROUP,
      offset: (page - 1) * MAX_PER_ACCORDION_GROUP,
    },
  })
}

export async function getTomogramsForRunAndDeposition({
  client,
  depositionId,
  runId,
  page,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  runId: number
  page: number
}): Promise<ApolloQueryResult<GetTomogramsForRunAndDepositionQuery>> {
  return client.query({
    query: GET_TOMOGRAMS_FOR_RUN_AND_DEPOSITION,
    variables: {
      depositionId,
      runId,
      limit: MAX_PER_FULLY_OPEN_ACCORDION,
      offset: (page - 1) * MAX_PER_FULLY_OPEN_ACCORDION,
    },
  })
}
