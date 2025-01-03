import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated__'
import { GetDatasetByIdQuery, Runs_Bool_Exp } from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'
import { getTiltRangeFilter } from 'app/utils/filter'

const GET_DATASET_BY_ID = gql(`
  query GetDatasetById(
    $id: Int,
    $run_limit: Int,
    $run_offset: Int,
    $filter: runs_bool_exp,
    $deposition_id: Int!,
  ) {
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

      funding_sources(
        order_by: [
          {
            funding_agency_name: asc
          },
          {
            grant_id: asc
          }
        ]
      ) {
        funding_agency_name
        grant_id
      }

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
        corresponding_author_status
        email
        name
        orcid
        primary_author_status
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

      runs(
        limit: $run_limit,
        offset: $run_offset,
        where: $filter,
        order_by: { name: asc }
      ) {
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

          tomograms(limit: 1, where: { neuroglancer_config: { _is_null: false } }) {
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

      filtered_runs_count: runs_aggregate(where: $filter) {
        aggregate {
          count
        }
      }

      run_stats: runs {
        tomogram_voxel_spacings {
          annotations {
            object_name

            files(distinct_on: shape_type) {
              shape_type
            }
          }
        }

        tiltseries(distinct_on: tilt_series_quality) {
          tilt_series_quality
        }
      }
    }

    deposition: depositions_by_pk(id: $deposition_id) {
      id
      title
    }
  }
`)

function getFilter(filterState: FilterState) {
  const filters: Runs_Bool_Exp[] = []

  if (filterState.includedContents.isGroundTruthEnabled) {
    filters.push({
      tomogram_voxel_spacings: {
        annotations: {
          ground_truth_status: {
            _eq: true,
          },
        },
      },
    })
  }

  // Deposition ID filter
  const depositionId = +(filterState.ids.deposition ?? Number.NaN)
  if (!Number.isNaN(depositionId) && depositionId > 0) {
    filters.push({
      tomogram_voxel_spacings: {
        annotations: { deposition_id: { _eq: depositionId } },
      },
    })
  }

  const tiltRangeFilter = getTiltRangeFilter(
    filterState.tiltSeries.min,
    filterState.tiltSeries.max,
  )

  if (tiltRangeFilter) {
    filters.push(tiltRangeFilter)
  }

  if (filterState.tiltSeries.qualityScore.length > 0) {
    filters.push({
      tiltseries: {
        tilt_series_quality: {
          _in: filterState.tiltSeries.qualityScore
            .map((score) => +score)
            .filter((val) => !Number.isNaN(val)),
        },
      },
    })
  }

  const { objectNames, objectShapeTypes, objectId } = filterState.annotation

  if (objectNames.length > 0) {
    filters.push({
      tomogram_voxel_spacings: {
        annotations: {
          object_name: {
            _in: objectNames,
          },
        },
      },
    })
  }

  if (objectShapeTypes.length > 0) {
    filters.push({
      tomogram_voxel_spacings: {
        annotations: {
          files: {
            shape_type: {
              _in: objectShapeTypes,
            },
          },
        },
      },
    })
  }

  if (objectId) {
    filters.push({
      tomogram_voxel_spacings: {
        annotations: {
          object_id: {
            _ilike: `%${objectId.replace(':', '_')}`,
          },
        },
      },
    })
  }

  return { _and: filters } as Runs_Bool_Exp
}

export async function getDatasetById({
  client,
  depositionId = -1,
  id,
  page = 1,
  params = new URLSearchParams(),
}: {
  client: ApolloClient<NormalizedCacheObject>
  depositionId?: number
  id: number
  page?: number
  params?: URLSearchParams
}): Promise<ApolloQueryResult<GetDatasetByIdQuery>> {
  return client.query({
    query: GET_DATASET_BY_ID,
    variables: {
      id,
      deposition_id: depositionId,
      run_limit: MAX_PER_PAGE,
      run_offset: (page - 1) * MAX_PER_PAGE,
      filter: getFilter(getFilterState(params)),
    },
  })
}
