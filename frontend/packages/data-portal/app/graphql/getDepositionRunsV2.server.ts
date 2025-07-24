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
 *
 * --- Pull 3 ---
 * Get all the annos or tomos (dependent on which flavor query you are using) for a specific
 * run in the context of a single deposition. We don't want _all_ the annos/tomos in the run,
 * we just want those that belong to the deposition and are inside the run. For annos specifically,
 * we have to pull shapes, since that's how we actually show Annotations to the user. We provide
 * pagination with this query, but strictly speaking, we don't have to: the number of annos/tomos
 * that belong to a single run are usually not that many, and I'd be quite surprised if it ever
 * went over 1k, so we could probably get away with grabbing all of them at once and handling
 * pagination purely in the FE. Still, it's easier to just offload it to the BE and it means
 * we can keep the same dev pattern as we have for Pull 2 and most of the other paginated
 * stuff in the app.
 *
 * I'm currently providing the total count of annos/tomos available for showing pagination
 * (the "1-5 of 52 Annotations" page count part), but on second thought, that's not strictly
 * necessary: we already have that info from Pull 2 above. Since Pull 2 gets the count of
 * annos/tomos belonging to each run in the current page of runs, this query doesn't have to
 * return it as well, it's duplicate info. But maybe it makes for an easier dev experience to
 * have it available? If you wind up using the count info from Pull 2 instead of Pull 3 to
 * provide the pagination count stuff, probably best to cut that part here just to avoid
 * future confusion since it would be dead wood.
 */
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

// Annotation flavor -- TODO create a tomogram flavor as well
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
