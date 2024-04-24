import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { performance } from 'perf_hooks'
import { match } from 'ts-pattern'

import { gql } from 'app/__generated__'
import { Datasets_Bool_Exp, Order_By } from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'
import { getTiltRangeFilter } from 'app/utils/filter'

const GET_DATASETS_DATA_QUERY = gql(`
  query GetDatasetsData(
    $limit: Int,
    $offset: Int,
    $order_by_dataset: order_by,
    $filter: datasets_bool_exp,
  ) {
    datasets(
      limit: $limit,
      offset: $offset,
      order_by: { title: $order_by_dataset },
      where: $filter
    ) {
      id
      title
      organism_name
      dataset_publications
      key_photo_thumbnail_url
      related_database_entries
      authors(
        order_by: {
          author_list_order: asc,
        },
      ) {
        name
        primary_author_status
      }

      runs_aggregate {
        aggregate {
          count
        }
      }

      runs {
        tomogram_voxel_spacings {
          annotations(distinct_on: object_name) {
            object_name
          }
        }
      }
    }

    datasets_aggregate {
      aggregate {
        count
      }
    }

    filtered_datasets_aggregate: datasets_aggregate(where: $filter) {
      aggregate {
        count
      }
    }

    organism_names: datasets(distinct_on: organism_name) {
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

function getFilter(filterState: FilterState, query: string) {
  const filters: Datasets_Bool_Exp[] = []

  // Text search by dataset title
  if (query) {
    filters.push({
      title: {
        _ilike: `%${query}%`,
      },
    })
  }

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

  // Portal ID filter
  const portalId = +(filterState.ids.portal ?? Number.NaN)
  if (!Number.isNaN(portalId) && portalId > 0) {
    idFilters.push({
      id: {
        _eq: portalId,
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

export async function getBrowseDatasets({
  client,
  orderBy,
  page = 1,
  params = new URLSearchParams(),
  query = '',
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: Order_By | null
  page?: number
  params?: URLSearchParams
  query?: string
}) {
  const start = performance.now()

  const results = await client.query({
    query: GET_DATASETS_DATA_QUERY,
    variables: {
      filter: getFilter(getFilterState(params), query),
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      order_by_dataset: orderBy,
    },
  })

  const end = performance.now()
  // eslint-disable-next-line no-console
  console.log(`getBrowseDatasets query perf: ${end - start}ms`)

  return results
}
