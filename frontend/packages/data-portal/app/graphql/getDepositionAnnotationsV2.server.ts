import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import type { GetDepositionAnnotationsQuery } from 'app/__generated_v2__/graphql'
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
