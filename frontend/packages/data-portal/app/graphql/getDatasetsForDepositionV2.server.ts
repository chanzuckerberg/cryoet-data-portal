import type { ApolloQueryResult } from '@apollo/client'

import { gql } from 'app/__generated_v2__'
import {
  GetDatasetsForDepositionViaAnnotationShapesQuery,
  GetDatasetsForDepositionViaTomogramsQuery,
} from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'

const GET_DATASETS_FOR_DEPOSITION_VIA_TOMOGRAMS = gql(`
  query getDatasetsForDepositionViaTomograms(
    $depositionId: Int!
  ) {
    tomogramsAggregate(where: {depositionId: {_eq: $depositionId}}) {
      aggregate {
        count(columns: id)
        groupBy {
          run {
            dataset {
              id
              title
              organismName
              organismTaxid
            }
          }
        }
      }
    }
  }
`)

// Strictly speaking, we can get the dataset info just as easily off annotations.
// But instead by pulling this off the AnnotationShapes, the count is accurate
// for how we display # annotations to the user (# shapes, not parent annotations)
const GET_DATASETS_FOR_DEPOSITION_VIA_ANNOTATION_SHAPES = gql(`
  query getDatasetsForDepositionViaAnnotationShapes(
    $depositionId: Int!
  ) {
    annotationShapesAggregate(
      where: {
        annotation: {
          depositionId: {_eq: $depositionId}
        }
      }
    ) {
      aggregate {
        count(columns: id)
        groupBy {
          annotation {
            run {
              dataset {
                id
                title
                organismName
                organismTaxid
              }
            }
          }
        }
      }
    }
  }
`)

export async function getDatasetsForDepositionViaTomograms(
  depositionId: number,
): Promise<ApolloQueryResult<GetDatasetsForDepositionViaTomogramsQuery>> {
  return apolloClientV2.query({
    query: GET_DATASETS_FOR_DEPOSITION_VIA_TOMOGRAMS,
    variables: {
      depositionId,
    },
  })
}

export async function getDatasetsForDepositionViaAnnotationShapes(
  depositionId: number,
): Promise<
  ApolloQueryResult<GetDatasetsForDepositionViaAnnotationShapesQuery>
> {
  return apolloClientV2.query({
    query: GET_DATASETS_FOR_DEPOSITION_VIA_ANNOTATION_SHAPES,
    variables: {
      depositionId,
    },
  })
}
