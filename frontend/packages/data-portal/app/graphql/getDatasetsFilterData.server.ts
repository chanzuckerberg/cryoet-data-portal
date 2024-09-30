import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { gql } from 'app/__generated__'

const GET_DATASETS_FILTER_DATA_QUERY = gql(`
  query GetDatasetsFilterData(
    $datasets_filter: datasets_bool_exp,
    $tiltseries_filter: tiltseries_bool_exp,
    $tomograms_filter: tomograms_bool_exp,
    $annotations_filter: annotations_bool_exp,
    $annotation_files_filter: annotation_files_bool_exp,
  ) {
    organism_names: datasets(where: $datasets_filter, distinct_on: organism_name) {
      organism_name
    }

    camera_manufacturers: tiltseries(where: $tiltseries_filter, distinct_on: camera_manufacturer) {
      camera_manufacturer
    }

    reconstruction_methods: tomograms(where: $tomograms_filter, distinct_on: reconstruction_method) {
      reconstruction_method
    }

    reconstruction_softwares: tomograms(where: $tomograms_filter, distinct_on: reconstruction_software) {
      reconstruction_software
    }

    object_names: annotations(where: $annotations_filter, distinct_on: object_name) {
      object_name
    }

    object_shape_types: annotation_files(where: $annotation_files_filter, distinct_on: shape_type) {
      shape_type
    }
  }
`)

export async function getDatasetsFilterData({
  client,
  depositionId,
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId: number | null
}) {
  const start = performance.now()

  const filter = {
    deposition_id: {
      _eq: depositionId,
    },
  }

  const results = await client.query({
    query: GET_DATASETS_FILTER_DATA_QUERY,
    variables: {
      datasets_filter: depositionId
        ? {
            runs: {
              tomogram_voxel_spacings: {
                annotations: filter,
              },
            },
          }
        : {},
      tiltseries_filter: depositionId ? filter : {},
      tomograms_filter: depositionId ? filter : {},
      annotations_filter: depositionId ? filter : {},
      annotation_files_filter: depositionId ? { annotation: filter } : {},
    },
  })

  const end = performance.now()
  // eslint-disable-next-line no-console
  console.log(`getDatasetsFilterData query perf: ${end - start}ms`)

  return results
}
