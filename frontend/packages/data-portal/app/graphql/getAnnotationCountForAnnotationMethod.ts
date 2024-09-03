import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { gql } from 'app/__generated__'

const GET_ANNOTATION_COUNT_FOR_ANNOTATION_METHOD = gql(`
  query GetAnnotationCountForAnnotationMethod(
    $deposition_id: Int!,
    $annotation_method: String!,
  ) {
    annotation_count: annotations_aggregate(where: {deposition_id: {_eq: $deposition_id}, annotation_method: {_eq: $annotation_method}}) {
      aggregate {
        count
      }
    }
  }
`)

export async function getAnnotationCountForAnnotationMethod({
  client,
  depositionId: deposition_id,
  annotationMethod: annotation_method,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number
  annotationMethod: string
}) {
  return client.query({
    query: GET_ANNOTATION_COUNT_FOR_ANNOTATION_METHOD,
    variables: { deposition_id, annotation_method },
  })
}
