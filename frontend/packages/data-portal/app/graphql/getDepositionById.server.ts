import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { match } from 'ts-pattern'

import { gql } from 'app/__generated__'
import { Datasets_Bool_Exp, Order_By } from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'
import { getTiltRangeFilter } from 'app/utils/filter'

const GET_DEPOSITION_BY_ID = gql(`
  query GetDepositionById(
    $id: Int!,
    $dataset_limit: Int,
    $dataset_offset: Int,
    $dataset_order_by: order_by,
    $filter: datasets_bool_exp!,
  ) {
    deposition: depositions_by_pk(id: $id) {
      s3_prefix

      # key photo
      key_photo_url

      # dates
      last_modified_date
      release_date
      deposition_date

      # metadata
      id
      title
      description

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

      # publication info
      related_database_entries
      deposition_publications

      # annotations
      annotations {
        annotation_method
        annotation_software
        method_links
        method_type

        files(distinct_on: shape_type) {
          shape_type
        }
      }

      annotations_aggregate {
        aggregate {
          count
        }
      }

      organism_names: dataset(distinct_on: organism_name) {
        organism_name
      }

      object_names: annotations(distinct_on: object_name) {
        object_name
      }
    }

    datasets(
      limit: $dataset_limit,
      offset: $dataset_offset,
      order_by: { title: $dataset_order_by },
      where: { _and: [$filter, {runs: {tomogram_voxel_spacings: {annotations: {deposition_id: {_eq: $id}}}}}] },
    ) {
      id
      title
      organism_name
      key_photo_thumbnail_url

      authors(
        order_by: {
          author_list_order: asc,
        },
      ) {
        name
        primary_author_status
        corresponding_author_status
      }

      runs_aggregate(where: {tomogram_voxel_spacings: {annotations: {deposition_id: {_eq: $id}}}}) {
        aggregate {
          count
        }
      }

      runs {
        tomogram_voxel_spacings {
          annotations(distinct_on: object_name) {
            object_name
          }

          annotations_aggregate(where: {deposition_id: {_eq: $id}}) {
            aggregate {
              count
            }
          }
        }
      }
    }

    datasets_aggregate(where: {runs: {tomogram_voxel_spacings: {annotations: {deposition_id: {_eq: $id}}}}}) {
      aggregate {
        count
      }
    }

    filtered_datasets_aggregate: datasets_aggregate(where: {_and: [$filter, {runs: {tomogram_voxel_spacings: {annotations: {deposition_id: {_eq: $id}}}}}]}) {
      aggregate {
        count
      }
    }
  }
`)

function getFilter(filterState: FilterState) {
  const filters: Datasets_Bool_Exp[] = []

  // TODO: combine this with getBrowseDatasets filter generator

  // Included contents filters

  // Ground truth filter
  if (filterState.includedContents.isGroundTruthEnabled) {
    filters.push({
      runs: {
        tomogram_voxel_spacings: {
          annotations: {
            ground_truth_status: {
              _eq: true,
            },
          },
        },
      },
    })
  }

  // Available files filter
  filterState.includedContents.availableFiles.forEach((file) =>
    match(file)
      .with('raw-frames', () =>
        filters.push({
          runs: {
            tiltseries: {
              frames_count: {
                _gt: 0,
              },
            },
          },
        }),
      )
      .with('tilt-series', () =>
        filters.push({
          runs: {
            tiltseries_aggregate: {
              count: {
                predicate: {
                  _gt: 0,
                },
              },
            },
          },
        }),
      )
      .with('tilt-series-alignment', () =>
        filters.push({
          runs: {
            tiltseries: {
              https_alignment_file: {
                _is_null: false,
              },
            },
          },
        }),
      )
      .with('tomogram', () =>
        filters.push({
          runs: {
            tomogram_voxel_spacings: {
              tomograms_aggregate: {
                count: {
                  predicate: {
                    _gt: 0,
                  },
                },
              },
            },
          },
        }),
      )
      .exhaustive(),
  )

  // Number of runs filter
  if (filterState.includedContents.numberOfRuns) {
    const runCount = +filterState.includedContents.numberOfRuns.slice(1)
    filters.push({
      runs_aggregate: {
        count: {
          predicate: { _gte: runCount },
        },
      },
    })
  }

  // Id filters
  const idFilters: Datasets_Bool_Exp[] = []

  // Dataset ID filter
  const datasetId = +(filterState.ids.dataset ?? Number.NaN)
  if (!Number.isNaN(datasetId) && datasetId > 0) {
    idFilters.push({
      id: {
        _eq: datasetId,
      },
    })
  }

  // Empiar filter
  const empiarId = filterState.ids.empiar
  if (empiarId) {
    idFilters.push({
      related_database_entries: {
        _like: `%EMPIAR-${empiarId}%`,
      },
    })
  }

  // EMDB filter
  const emdbId = filterState.ids.emdb
  if (emdbId) {
    idFilters.push({
      related_database_entries: {
        _like: `%EMD-${emdbId}%`,
      },
    })
  }

  if (idFilters.length > 0) {
    filters.push({ _or: idFilters })
  }

  // Author filters

  // Author name filter
  if (filterState.author.name) {
    filters.push({
      authors: {
        name: {
          _ilike: `%${filterState.author.name}%`,
        },
      },
    })
  }

  // Author Orcid filter
  if (filterState.author.orcid) {
    filters.push({
      authors: {
        orcid: {
          _ilike: `%${filterState.author.orcid}%`,
        },
      },
    })
  }

  // Sample and experiment condition filters
  const { organismNames } = filterState.sampleAndExperimentConditions

  // Organism name filter
  if (organismNames.length > 0) {
    filters.push({
      organism_name: { _in: organismNames },
    })
  }

  // Hardware filters

  // Camera manufacturer filter
  if (filterState.hardware.cameraManufacturer) {
    filters.push({
      runs: {
        tiltseries: {
          camera_manufacturer: {
            _eq: filterState.hardware.cameraManufacturer,
          },
        },
      },
    })
  }

  // Tilt series metadata filters
  const tiltRangeFilter = getTiltRangeFilter(
    filterState.tiltSeries.min,
    filterState.tiltSeries.max,
  )

  if (tiltRangeFilter) {
    filters.push({
      runs: tiltRangeFilter,
    })
  }

  // Tomogram metadata filters
  if (filterState.tomogram.fiducialAlignmentStatus) {
    filters.push({
      runs: {
        tomogram_voxel_spacings: {
          tomograms: {
            fiducial_alignment_status: {
              _eq:
                filterState.tomogram.fiducialAlignmentStatus === 'true'
                  ? 'FIDUCIAL'
                  : 'NON_FIDUCIAL',
            },
          },
        },
      },
    })
  }

  // Reconstruction method filter
  if (filterState.tomogram.reconstructionMethod) {
    filters.push({
      runs: {
        tomogram_voxel_spacings: {
          tomograms: {
            reconstruction_method: {
              _eq: filterState.tomogram.reconstructionMethod,
            },
          },
        },
      },
    })
  }

  // Reconstruction software filter
  if (filterState.tomogram.reconstructionSoftware) {
    filters.push({
      runs: {
        tomogram_voxel_spacings: {
          tomograms: {
            reconstruction_software: {
              _eq: filterState.tomogram.reconstructionSoftware,
            },
          },
        },
      },
    })
  }

  // Annotation filters
  const { objectNames, objectShapeTypes } = filterState.annotation

  // Object names filter
  if (objectNames.length > 0) {
    filters.push({
      runs: {
        tomogram_voxel_spacings: {
          annotations: {
            object_name: {
              _in: objectNames,
            },
          },
        },
      },
    })
  }

  // Object shape type filter
  if (objectShapeTypes.length > 0) {
    filters.push({
      runs: {
        tomogram_voxel_spacings: {
          annotations: {
            files: {
              shape_type: {
                _in: objectShapeTypes,
              },
            },
          },
        },
      },
    })
  }

  return { _and: filters } as Datasets_Bool_Exp
}

export async function getDepositionById({
  client,
  id,
  orderBy,
  page = 1,
  params = new URLSearchParams(),
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: Order_By | null
  id: number
  page?: number
  params?: URLSearchParams
}) {
  return client.query({
    query: GET_DEPOSITION_BY_ID,
    variables: {
      id,
      dataset_limit: MAX_PER_PAGE,
      dataset_offset: (page - 1) * MAX_PER_PAGE,
      dataset_order_by: orderBy,
      filter: getFilter(getFilterState(params)),
    },
  })
}
