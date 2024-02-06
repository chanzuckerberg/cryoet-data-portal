import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { isNumber } from 'lodash-es'
import { match } from 'ts-pattern'

import { gql } from 'app/__generated__'
import { Datasets_Bool_Exp, Order_By } from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { DEFAULT_TILT_MAX, DEFAULT_TILT_MIN } from 'app/constants/tiltSeries'
import { FilterState, getFilterState } from 'app/hooks/useFilter'

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

    object_shape_types: annotations {
      files(distinct_on: shape_type) {
        shape_type
      }
    }
  }
`)

function getTiltValue(value: string | null) {
  if (value && !Number.isNaN(+value)) {
    return +value
  }

  return null
}

function getFilter(datasetFilter: FilterState, query: string) {
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
  if (datasetFilter.includedContents.isGroundTruthEnabled) {
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
  datasetFilter.includedContents.availableFiles.forEach((file) =>
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
  if (datasetFilter.includedContents.numberOfRuns) {
    const runCount = +datasetFilter.includedContents.numberOfRuns.slice(1)
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
  const portalId = +(datasetFilter.ids.portal ?? Number.NaN)
  if (!Number.isNaN(portalId) && portalId > 0) {
    idFilters.push({
      id: {
        _eq: portalId,
      },
    })
  }

  // Empiar filter
  const empiarId = datasetFilter.ids.empiar
  if (empiarId) {
    idFilters.push({
      related_database_entries: {
        _like: `%EMPIAR-${empiarId}%`,
      },
    })
  }

  // EMDB filter
  const emdbId = datasetFilter.ids.emdb
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
  if (datasetFilter.author.name) {
    filters.push({
      authors: {
        name: {
          _ilike: `%${datasetFilter.author.name}%`,
        },
      },
    })
  }

  // Author Orcid filter
  if (datasetFilter.author.orcid) {
    filters.push({
      authors: {
        orcid: {
          _ilike: `%${datasetFilter.author.orcid}%`,
        },
      },
    })
  }

  // Sample and experiment condition filters
  const { organismNames } = datasetFilter.sampleAndExperimentConditions

  // Organism name filter
  if (organismNames.length > 0) {
    filters.push({
      organism_name: { _in: organismNames },
    })
  }

  // Hardware filters
  // Camera manufacturer filter
  if (datasetFilter.hardware.cameraManufacturer) {
    filters.push({
      runs: {
        tiltseries: {
          camera_manufacturer: {
            _eq: datasetFilter.hardware.cameraManufacturer,
          },
        },
      },
    })
  }

  // Tilt series metadata filters
  let tiltMin = getTiltValue(datasetFilter.tiltSeries.min)
  let tiltMax = getTiltValue(datasetFilter.tiltSeries.max)

  if (isNumber(tiltMin) && !isNumber(tiltMax)) {
    tiltMax = DEFAULT_TILT_MAX
  }

  if (!isNumber(tiltMin) && isNumber(tiltMax)) {
    tiltMin = DEFAULT_TILT_MIN
  }

  // Tilt range filter
  if (tiltMin) {
    filters.push({
      runs: {
        tiltseries: {
          tilt_range: {
            _gte: tiltMin,
          },
        },
      },
    })
  }

  if (tiltMax) {
    filters.push({
      runs: {
        tiltseries: {
          tilt_range: {
            _lte: tiltMax,
          },
        },
      },
    })
  }

  // Tomogram metadata filters
  if (datasetFilter.tomogram.fiducialAlignmentStatus) {
    filters.push({
      runs: {
        tomogram_voxel_spacings: {
          tomograms: {
            fiducial_alignment_status: {
              _eq:
                datasetFilter.tomogram.fiducialAlignmentStatus === 'true'
                  ? 'FIDUCIAL'
                  : 'NON_FIDUCIAL',
            },
          },
        },
      },
    })
  }

  // Reconstruction method filter
  if (datasetFilter.tomogram.reconstructionMethod) {
    filters.push({
      runs: {
        tomogram_voxel_spacings: {
          tomograms: {
            reconstruction_method: {
              _eq: datasetFilter.tomogram.reconstructionMethod,
            },
          },
        },
      },
    })
  }

  // Reconstruction software filter
  if (datasetFilter.tomogram.reconstructionSoftware) {
    filters.push({
      runs: {
        tomogram_voxel_spacings: {
          tomograms: {
            reconstruction_software: {
              _eq: datasetFilter.tomogram.reconstructionSoftware,
            },
          },
        },
      },
    })
  }

  // Annotation filters
  const { objectNames, objectShapeTypes } = datasetFilter.annotation

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
  return client.query({
    query: GET_DATASETS_DATA_QUERY,
    variables: {
      filter: getFilter(getFilterState(params), query),
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      order_by_dataset: orderBy,
    },
  })
}
