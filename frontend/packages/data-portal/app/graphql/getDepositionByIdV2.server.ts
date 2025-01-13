import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { match } from 'ts-pattern'

import { Datasets_Bool_Exp, Order_By } from 'app/__generated__/graphql'
import { gql } from 'app/__generated_v2__'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'
import { getTiltRangeFilter } from 'app/utils/filter'

const GET_DEPOSITION_BY_ID = gql(`
  query GetDepositionByIdV2(
    $depositionId: Int!,
    $datasetsLimit: Int,
    $datasetsOffset: Int,
    $datasetsOrderBy: OrderByEnum,
    $datasetsFilter: DatasetWhereClause!,
    # For DatasetsAggregates only:
    $datasetsByDepositionFilter: DatasetWhereClause,
    $tiltseriesByDepositionFilter: TiltseriesWhereClause,
    $tomogramsByDepositionFilter: TomogramWhereClause,
    $annotationsByDepositionFilter: AnnotationWhereClause,
    $annotationShapesByDepositionFilter: AnnotationShapeWhereClause
  ) {
    # Deposition:
    depositions(where: { id: { _eq: $depositionId }}) {
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
      annotationsAggregate {
        aggregate {
          count
        }
      }
      distinctOrganismNames: datasetsAggregate {
        aggregate {
          count
          groupBy {
            organismName
          }
        }
      }
      distinctObjectNames: annotationsAggregate {
        aggregate {
          count
          groupBy {
            objectName
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
            annotationSoftware
            methodType
            methodLinks {
              link
              linkType
              name
            }
          }
        }
      }
    }

    # Datasets:
    # This section is very similar to the datasets page.
    datasets(
      where: $filter
      orderBy: $orderBy,
      limitOffset: {
        limit: $limit,
        offset: $offset
      }
    ) {
      id
      title
      organismName
      datasetPublications
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
      runsCount: runsAggregate(where: { annotations: { depositionId: { _eq: $depositionId }}}) {
        aggregate {
          count
        }
      }
      runs {
        edges {
          node {
            annotationsAggregate(where: { depositionId: { _eq: $depositionId }}) {
              aggregate {
                count
                groupBy {
                  objectName
                }
              }
            }
          }
        }
      }
    }

    ...DatasetsAggregates
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
  const depositionIdFilter = {
    depositionId: {
      _eq: id,
    },
  }

  return client.query({
    query: GET_DEPOSITION_BY_ID,
    variables: {
      depositionId: id,
      datasetsLimit: MAX_PER_PAGE,
      datasetsOffset: (page - 1) * MAX_PER_PAGE,
      datasetsOrderBy: orderBy,
      datasetsFilter: getFilter(getFilterState(params)),
      datasetsByDepositionFilter: depositionIdFilter,
      tiltseriesByDepositionFilter: depositionIdFilter,
      tomogramsByDepositionFilter: depositionIdFilter,
      annotationsByDepositionFilter: depositionIdFilter,
      annotationShapesByDepositionFilter: depositionIdFilter,
    },
  })
}
