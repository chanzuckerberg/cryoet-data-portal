import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { URLSearchParams } from 'url'

import { gql } from 'app/__generated__'
import { Annotations_Bool_Exp } from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'

const GET_RUN_BY_ID_QUERY = gql(`
  query GetRunById($id: Int, $limit: Int, $offset: Int, $filter: annotations_bool_exp) {
    runs(where: { id: { _eq: $id } }) {
      id
      name

      tiltseries {
        acceleration_voltage
        aligned_tiltseries_binning
        binning_from_frames
        camera_manufacturer
        camera_model
        data_acquisition_software
        id
        is_aligned
        microscope_additional_info
        microscope_energy_filter
        microscope_image_corrector
        microscope_manufacturer
        microscope_model
        microscope_phase_plate
        pixel_spacing
        related_empiar_entry
        spherical_aberration_constant
        tilt_axis
        tilt_max
        tilt_min
        tilt_range
        tilt_series_quality
        tilt_step
        tilting_scheme
        total_flux
      }

      dataset {
        cell_component_name
        cell_component_id
        cell_name
        cell_strain_name
        cell_strain_id
        cell_type_id
        dataset_publications
        deposition_date
        description
        grid_preparation
        id
        last_modified_date
        organism_name
        organism_taxid
        other_setup
        related_database_entries
        related_database_entries
        release_date
        s3_prefix
        sample_preparation
        sample_type
        tissue_name
        tissue_id
        title

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

        authors_with_affiliation: authors(where: { affiliation_name: { _is_null: false } }) {
          name
          affiliation_name
        }

        funding_sources {
          funding_agency_name
          grant_id
        }
      }

      tomogram_voxel_spacings(limit: 1) {
        id
        s3_prefix

        tomograms(
          limit: 1,
          where: {
            is_canonical: { _eq: true }
          },
        ) {
          affine_transformation_matrix
          ctf_corrected
          fiducial_alignment_status
          id
          key_photo_url
          name
          neuroglancer_config
          processing
          processing_software
          reconstruction_method
          reconstruction_software
          size_x
          size_y
          size_z
          voxel_spacing
        }
      }

      annotation_table: tomogram_voxel_spacings {
        annotations(
          limit: $limit,
          offset: $offset,
          where: $filter,
          order_by: [
            { ground_truth_status: desc }
            { deposition_date: desc }
            { id: desc }
          ],
        ) {
          annotation_method
          annotation_publication
          annotation_software
          confidence_precision
          confidence_recall
          deposition_date
          ground_truth_status
          ground_truth_used
          id
          is_curator_recommended
          last_modified_date
          method_type
          object_count
          object_description
          object_id
          object_name
          object_state
          release_date

          files {
            format
            https_path
            s3_path
            shape_type
          }

          authors(order_by: { author_list_order: asc }) {
            primary_author_status
            corresponding_author_status
            name
            email
            orcid
          }

          author_affiliations: authors(distinct_on: affiliation_name) {
            affiliation_name
          }

          authors_aggregate {
            aggregate {
              count
            }
          }
        }
      }

      tomogram_stats: tomogram_voxel_spacings {
        annotations {
          object_name
          annotation_software

          files(distinct_on: shape_type) {
            shape_type
          }
        }

        annotations_aggregate {
          aggregate {
            count
          }
        }

        filtered_annotations_count: annotations_aggregate(where: $filter) {
          aggregate {
            count
          }
        }

        tomograms_aggregate {
          aggregate {
            count
          }
        }

        tomogram_processing: tomograms(distinct_on: processing) {
          processing
        }

        tomogram_resolutions: tomograms(distinct_on: voxel_spacing) {
          https_mrc_scale0
          id
          processing
          s3_mrc_scale0
          s3_omezarr_dir
          size_x
          size_y
          size_z
          voxel_spacing
        }
      }

      tiltseries_aggregate {
        aggregate {
          avg {
            tilt_series_quality
          }

          sum {
            frames_count
          }

          count
        }
      }
    }
  }
`)

function getFilter(filterState: FilterState) {
  const filters: Annotations_Bool_Exp[] = []

  const { name, orcid } = filterState.author

  if (name) {
    filters.push({
      authors: {
        name: {
          _ilike: `%${name}%`,
        },
      },
    })
  }

  if (orcid) {
    filters.push({
      authors: {
        orcid: {
          _ilike: `%${orcid}%`,
        },
      },
    })
  }

  const {
    objectNames,
    objectShapeTypes,
    annotationSoftwares,
    methodTypes,
    goId,
  } = filterState.annotation

  if (objectNames.length > 0) {
    filters.push({
      object_name: {
        _in: objectNames,
      },
    })
  }

  if (goId) {
    filters.push({
      object_id: {
        _ilike: `%${goId.replace(':', '_')}`,
      },
    })
  }

  if (objectShapeTypes.length > 0) {
    filters.push({
      files: {
        shape_type: {
          _in: objectShapeTypes,
        },
      },
    })
  }

  if (methodTypes.length > 0) {
    filters.push({
      method_type: {
        _in: methodTypes,
      },
    })
  }

  if (annotationSoftwares.length > 0) {
    filters.push({
      annotation_software: {
        _in: annotationSoftwares,
      },
    })
  }

  return { _and: filters } as Annotations_Bool_Exp
}

export async function getRunById({
  client,
  id,
  page = 1,
  params = new URLSearchParams(),
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  page?: number
  params?: URLSearchParams
}) {
  return client.query({
    query: GET_RUN_BY_ID_QUERY,
    variables: {
      id,
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      filter: getFilter(getFilterState(params)),
    },
  })
}
