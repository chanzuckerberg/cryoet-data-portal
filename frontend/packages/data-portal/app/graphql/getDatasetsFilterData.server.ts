import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { gql } from 'app/__generated__'
import { Datasets_Bool_Exp } from 'app/__generated__/graphql'

const GET_DATASETS_FILTER_DATA_QUERY = gql(`
  query GetDatasetsFilterData(
    $filter: datasets_bool_exp,
  ) {
    organism_names: datasets(where: $filter, distinct_on: organism_name) {
      organism_name
    }

    camera_manufacturers: tiltseries(distinct_on: camera_manufacturer) {
      camera_manufacturer
    }

    reconstruction_methods: tomograms(distinct_on: reconstruction_method) {
      reconstruction_method
    }

    reconstruction_softwares: tomograms(distinct_on: reconstruction_software) {
      reconstruction_software
    }

    object_names: annotations(distinct_on: object_name) {
      object_name
    }

    object_shape_types: annotation_files(distinct_on: shape_type) {
      shape_type
    }
  }
`)

export async function getDatasetsFilterData({
  client,
  filter = {},
}: {
  client: ApolloClient<NormalizedCacheObject>
  filter: Datasets_Bool_Exp
}) {
  const start = performance.now()

  const results = await client.query({
    query: GET_DATASETS_FILTER_DATA_QUERY,
    variables: {
      filter,
    },
  })

  const end = performance.now()
  // eslint-disable-next-line no-console
  console.log(`getDatasetsFilterData query perf: ${end - start}ms`)

  return results
}
