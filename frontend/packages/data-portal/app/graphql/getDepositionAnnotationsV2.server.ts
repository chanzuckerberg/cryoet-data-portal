/**
 * - Created new version of GET_DEPOSITION_ANNOTATIONS that handles sorting and dataset filtering
 * - Note the `pageSize` arg for the function to do client query on above
 *   This is necessary because we serve the same kind of data whether we filter based on user
 *   directly filtering for a dataset or doing a "Group by" on organism, BUT the page size of
 *   those two cases is different (20 for the former, 5 for the latter)
 * - Possible we could optimize the annotationFiles out of existence, pull the path from
 *   the Annotation path (either s3MetadataPath or httpsMetadataPath, same diff for the
 *   number we want out of the path), but I don't know if different shapes have different
 *   files or they all belong to the same file somehow, needs more data exploration.
 * - I didn't have time to write the equivalent version of this for tomograms, but I think it will
 *   be extremely similar. Sorry!
 */
import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import type { GetDepositionAnnotationsForDatasetsQuery, GetDepositionAnnotationsQuery } from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'

const GET_DEPOSITION_ANNOTATIONS = gql(`
  query GetDepositionAnnotations(
    $id: Int!,
    $limit: Int!,
    $offset: Int!,
  ) {
    annotationShapes(
      where: {
        annotation: {
          depositionId: {
            _eq: $id
          },
        },
      },

      limitOffset: {
        limit: $limit,
        offset: $offset,
      },
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
  }
`)

// I expect there's some way to pass a `null` sort of datasetIds filter that instead
// will not perform a filter on dataset ids, but I didn't have time to explore how, so
// // for now we just have two queries.
const GET_DEPOSITION_ANNOTATIONS_FOR_DATASETS = gql(`
  query GetDepositionAnnotationsForDatasets(
    $depositionId: Int!,
    $datasetIds: [Int!]!,
    $limit: Int!,
    $offset: Int!,
  ) {
    annotationShapes(
      where: {
        annotation: {
          depositionId: {
            _eq: $depositionId
          },
          run: {
            datasetId:{
              _in: $datasetIds
            },
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
  }
`)

export async function getDepositionAnnotations({
  client,
  id,
  page,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  page: number
}): Promise<ApolloQueryResult<GetDepositionAnnotationsQuery>> {
  return client.query({
    query: GET_DEPOSITION_ANNOTATIONS,
    variables: {
      id,
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
    },
  })
}

export async function getDepositionAnnotationsForDatasets({
  client,
  depositionId,
  datasetIds,
  pageSize = MAX_PER_PAGE,
  page,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  datasetIds: number[]
  pageSize?: number
  page: number
}): Promise<ApolloQueryResult<GetDepositionAnnotationsForDatasetsQuery>> {
  return client.query({
    query: GET_DEPOSITION_ANNOTATIONS_FOR_DATASETS,
    variables: {
      depositionId,
      datasetIds,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
  })
}
