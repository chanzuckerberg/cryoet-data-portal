import type {
  ApolloClient,
  ApolloQueryResult,
  NormalizedCacheObject,
} from '@apollo/client'

import { gql } from 'app/__generated__'
import {
  Annotation_Files_Bool_Exp,
  Annotations_Bool_Exp,
  GetRunByIdQuery,
} from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'

const GET_RUN_BY_ID_QUERY = gql(`
  query GetRunById(
    $id: Int,
    $limit: Int,
    $annotationsOffset: Int,
    $filter: [annotations_bool_exp!],
    $fileFilter: [annotation_files_bool_exp!]
    $deposition_id: Int,
  ) {
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

      tomogram_voxel_spacings(
        limit: 1
        where: {
          tomograms: {
            is_canonical: { _eq: true}
          }
        }
      ) {
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

    # Annotations table:
    annotation_files(
      where: {
        format: {
          _neq: "zarr" # TODO: Remove hack, migrate to new annotation + shape object.
        }
        annotation: {
          tomogram_voxel_spacing: {
            run_id: {
              _eq: $id
            }
          }
          _and: $filter
        }
        _and: $fileFilter
      }
      order_by: [
        {
          annotation: {
            ground_truth_status: desc
          }
        },
        {
          annotation: {
            deposition_date: desc
          }
        },
        {
          annotation_id: desc
        }
      ]
      limit: $limit
      offset: $annotationsOffset
    ) {
      shape_type
      format

      annotation {
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

        files(where: { _and: $fileFilter }) {
          shape_type
          format
          https_path
          s3_path
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

    # Tomograms table:
    tomograms(where: { tomogram_voxel_spacing: { run_id: { _eq: $id }}}) {
      affine_transformation_matrix
      ctf_corrected
      fiducial_alignment_status
      id
      is_canonical
      key_photo_thumbnail_url
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
      deposition {
        deposition_date
      }
      tomogram_voxel_spacing {
        id
        s3_prefix
      }
      authors {
        primary_author_status
        corresponding_author_status
        name
        email
        orcid
      }
    }

    # Tomograms download:
    tomograms_for_download: tomograms(
      where: { tomogram_voxel_spacing: { run_id: { _eq: $id } } }
    ) {
      https_mrc_scale0
      id
      processing
      reconstruction_method
      s3_mrc_scale0
      s3_omezarr_dir
      size_x
      size_y
      size_z
      voxel_spacing
    }

    # Annotation metadata:
    annotations_for_softwares: annotations(
      where: { tomogram_voxel_spacing: { run_id: { _eq: $id } } }
      distinct_on: annotation_software
    ) {
      annotation_software
    }
    annotations_for_object_names: annotations(
      where: { tomogram_voxel_spacing: { run_id: { _eq: $id } } }
      distinct_on: object_name
    ) {
      object_name
    }
    annotation_files_for_shape_types: annotation_files(
      where: { annotation: { tomogram_voxel_spacing: { run_id: { _eq: $id } } } }
      distinct_on: shape_type
    ) {
      shape_type
    }

    # Tomogram metadata:
    tomograms_for_resolutions: tomograms(
      where: { tomogram_voxel_spacing: { run_id: { _eq: $id } } }
      distinct_on: voxel_spacing
      order_by: { voxel_spacing: asc  }
    ) {
      voxel_spacing
    }
    tomograms_for_distinct_processing_methods: tomograms(
      where: { tomogram_voxel_spacing: { run_id: { _eq: $id } } }
      distinct_on: processing
      order_by: { processing: asc }
    ) {
      processing
    }

    # Annotation counts:
    annotation_files_aggregate_for_total: annotation_files_aggregate(
      where: {
        annotation: {
          tomogram_voxel_spacing: {
            run_id: {
              _eq: $id
            }
          }
        }
      }
      distinct_on: [annotation_id, shape_type]
    ) {
      aggregate {
        count
      }
    }
    annotation_files_aggregate_for_filtered: annotation_files_aggregate(
      where: {
        annotation: {
          tomogram_voxel_spacing: {
            run_id: {
              _eq: $id
            }
          }
          _and: $filter
        }
        _and: $fileFilter
      }
      distinct_on: [annotation_id, shape_type]
    ) {
      aggregate {
        count
      }
    }
    annotation_files_aggregate_for_ground_truth: annotation_files_aggregate(
      where: {
        annotation: {
          ground_truth_status: {
            _eq: true
          }
          tomogram_voxel_spacing: {
            run_id: {
              _eq: $id
            }
          }
          _and: $filter
        }
        _and: $fileFilter
      }
      distinct_on: [annotation_id, shape_type]
    ) {
      aggregate {
        count
      }
    }
    annotation_files_aggregate_for_other: annotation_files_aggregate(
      where: {
        annotation: {
          ground_truth_status: {
            _eq: false
          }
          tomogram_voxel_spacing: {
            run_id: {
              _eq: $id
            }
          }
          _and: $filter
        }
        _and: $fileFilter
      }
      distinct_on: [annotation_id, shape_type]
    ) {
      aggregate {
        count
      }
    }

    # Tomogram counts:
    tomograms_aggregate(where: { tomogram_voxel_spacing: { run_id: { _eq: $id }}}) {
      aggregate {
        count
      }
    }

    deposition: datasets(where: { id: { _eq: $deposition_id } }) {
      id
      title
    }
  }
`)

function getFilter(filterState: FilterState): Annotations_Bool_Exp[] {
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

  const { objectNames, annotationSoftwares, methodTypes, objectId } =
    filterState.annotation

  if (objectNames.length > 0) {
    filters.push({
      object_name: {
        _in: objectNames,
      },
    })
  }

  if (objectId) {
    filters.push({
      object_id: {
        _ilike: `%${objectId.replace(':', '_')}`,
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

  return filters
}

function getFileFilter(filterState: FilterState): Annotation_Files_Bool_Exp[] {
  const filters: Annotation_Files_Bool_Exp[] = []

  const { objectShapeTypes } = filterState.annotation

  if (objectShapeTypes.length > 0) {
    filters.push({
      shape_type: {
        _in: objectShapeTypes,
      },
    })
  }

  return filters
}

export async function getRunById({
  client,
  id,
  annotationsPage,
  params = new URLSearchParams(),
  depositionId = -1,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  annotationsPage: number
  params?: URLSearchParams
  depositionId?: number
}): Promise<ApolloQueryResult<GetRunByIdQuery>> {
  return client.query({
    query: GET_RUN_BY_ID_QUERY,
    variables: {
      id,
      limit: MAX_PER_PAGE,
      annotationsOffset: (annotationsPage - 1) * MAX_PER_PAGE,
      filter: getFilter(getFilterState(params)),
      fileFilter: getFileFilter(getFilterState(params)),
      deposition_id: depositionId,
    },
  })
}
