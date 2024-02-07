import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { gql } from 'app/__generated__'
import { MAX_PER_PAGE } from 'app/constants/pagination'

const GET_DATASET_BY_ID = gql(`
  query GetDatasetById($id: Int, $run_limit: Int, $run_offset: Int) {
    datasets(where: { id: { _eq: $id } }) {
      s3_prefix

      # key photo
      key_photo_url

      # Dataset dates
      last_modified_date
      release_date
      deposition_date

      # Dataset metadata
      id
      title
      description

      funding_sources {
        funding_agency_name
        grant_id
      }

      related_database_entries
      dataset_citations

      # Sample and experiments data
      cell_component_name
      cell_component_id
      cell_name
      cell_strain_name
      cell_strain_id
      cell_type_id
      grid_preparation
      organism_name
      organism_taxid
      other_setup
      sample_preparation
      sample_type
      tissue_name
      tissue_id
      authors(
        order_by: {
          author_list_order: asc,
        },
      ) {
        name
        email
        primary_author_status
        corresponding_author_status
      }

      authors_with_affiliation: authors(where: {affiliation_name: {_is_null: false}}) {
        name
        affiliation_name
      }

      # publication info
      related_database_entries
      dataset_publications

      # Tilt Series
      run_metadata: runs(limit: 1) {
        tiltseries(limit: 1) {
          acceleration_voltage
          spherical_aberration_constant
          microscope_manufacturer
          microscope_model
          microscope_energy_filter
          microscope_phase_plate
          microscope_image_corrector
          microscope_additional_info
          camera_manufacturer
          camera_model
        }
      }

      runs(limit: $run_limit, offset: $run_offset) {
        id
        name

        tiltseries_aggregate {
          aggregate {
            avg {
              tilt_series_quality
            }
          }
        }

        tomogram_voxel_spacings {
          annotations(distinct_on: object_name) {
            object_name
          }

          tomograms(limit: 1) {
            id
            key_photo_thumbnail_url
            neuroglancer_config
          }
        }
      }

      runs_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`)

export async function getDatasetById({
  client,
  id,
  page = 1,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  page?: number
}) {
  return client.query({
    query: GET_DATASET_BY_ID,
    variables: {
      id,
      run_limit: MAX_PER_PAGE,
      run_offset: (page - 1) * MAX_PER_PAGE,
    },
  })
}
