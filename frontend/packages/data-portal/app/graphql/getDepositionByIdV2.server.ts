import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { match } from 'ts-pattern'

import { Datasets_Bool_Exp, Order_By } from 'app/__generated__/graphql'
import { gql } from 'app/__generated_v2__'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'
import { getTiltRangeFilter } from 'app/utils/filter'

const GET_DEPOSITION_BY_ID = gql(`
  query GetDepositionByIdV2(
    $id: Int!,
    $datasetLimit: Int,
    $datasetOffset: Int,
    $datasetOrderBy: OrderByEnum,
    $filter: DatasetWhereClause!,
  ) {
    depositions(where: { id: { _eq: $id }}) {
      edges {
        node {
          depositionDate
          depositionPublications
          description
          id
          keyPhotoUrl
          lastModifiedDate
          relatedDatabaseEntries
          releaseDate
          s3Prefix
          title
          authors(orderBy: { authorListOrder: asc }) {
            edges {
              node {
                correspondingAuthorStatus
                email
                name
                orcid
                primaryAuthorStatus
              }
            }
          }
          distinctShapeTypes: annotationsAggregate {
            aggregate {
                count
                groupBy {
                    annotationShapes {
                        shapeType
                    }
                }
            }
          }
          annotationMethodCounts: annotationsAggregate {
            aggregate {
                count
                groupBy {
                    annotationMethod
                }
            }
            edges {
              node {
                annotationMethod
                annotationSoftware
                methodLinks
                methodType
              }
            }
          }

          annotationsAggregate {
            aggregate {
              count
            }
          }

          organismNames: datasets(distinctOn: organismName) {
            edges {
              node {
                organismName
              }
            }
          }

          objectNames: annotations(distinctOn: objectName) {
            edges {
              node {
                objectName
              }
            }
          }
        }
      }
    }

    # This section is very similar to the datasets page.
    datasets(
      limitOffset: {
        limit: $datasetLimit,
        offset: $datasetOffset
      },
      orderBy: { title: $datasetOrderBy },
      where: {
        _and: [
          $filter,
          { runs: { annotations: { depositionId: { _eq: $id }}}}
        ]
      },
    ) {
      id
      title
      organismName
      keyPhotoThumbnailUrl

      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            name
            primaryAuthorStatus
            correspondingAuthorStatus
          }
        }
      }

      runsAggregate(where: { annotations: { depositionId: { _eq: $id }}}) {
        aggregate {
          count
        }
      }

      runs {
        annotations(distinctOn: objectName) {
          edges {
            node {
              objectName
            }
          }
        }

        annotationsAggregate(where: { depositionId: { _eq: $id }}) {
          aggregate {
            count
          }
        }
      }
    }

    datasetsAggregate(where: { runs: { annotations: { depositionId: { _eq: $id }}}}) {
      aggregate {
        count
      }
    }

    filteredDatasetsAggregate: datasetsAggregate(
      where: {
        _and: [
          $filter,
          { runs: { annotations: { depositionId: { _eq: $id }}}}
        ]
      }
    ) {
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
