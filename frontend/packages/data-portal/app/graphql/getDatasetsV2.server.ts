import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { performance } from 'perf_hooks'
import { match } from 'ts-pattern'

import { gql } from 'app/__generated_v2__'
import { Datasets_Bool_Exp, Order_By } from 'app/__generated__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { FilterState, getFilterState } from 'app/hooks/useFilter'
import { getTiltRangeFilter } from 'app/utils/filter'
import { DatasetWhereClause } from 'app/__generated_v2__/graphql'

const GET_DATASETS_DATA_QUERY = gql(`
  query GetDatasetsDataV2(
    $limit: Int,
    $offset: Int,
    $orderBy: DatasetOrderByClause!,
    $filter: DatasetWhereClause!
  ) {
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
      relatedDatabaseEntries
      authors(orderBy: { authorListOrder: asc }) {
        edges {
          node {
            name
            primaryAuthorStatus
            correspondingAuthorStatus
          }
        }
      }
      runsCount: runsAggregate {
        aggregate {
          count
        }
      }
      distinctObjectNames: runsAggregate {
        aggregate {
          count
          groupBy {
            annotations: {
              objectName
            }
          }
        }
      }
    }

    totalDatasetsCount: datasetsAggregate {
      aggregate {
        count
      }
    }
    filteredDatasetsCount: datasetsAggregate(where: $filter) {
      aggregate {
        count
      }
    }
  }
`)

function getFilter(filterState: FilterState, searchText: string) {
  const where: DatasetWhereClause = {}

  // Search by Dataset Name
  if (searchText) {
    where.title = {
      _ilike: `%${searchText}%`,
    }
  }

  // Included Contents section:
  // Ground Truth Annotation
  if (filterState.includedContents.isGroundTruthEnabled) {
    where.runs = {
      annotations: {
        groundTruthStatus: {
          _eq: true,
        },
      },
    }
  }
  // Available Files
  // TODO(bchu): Implement when available in API.
  // filterState.includedContents.availableFiles.forEach((file) =>
  //   match(file)
  //     .with('raw-frames', () =>
  //       where.push({
  //         runs: {
  //           tiltseries: {
  //             frames_count: {
  //               _gt: 0,
  //             },
  //           },
  //         },
  //       }),
  //     )
  //     .with('tilt-series', () =>
  //       where.push({
  //         runs: {
  //           tiltseries_aggregate: {
  //             count: {
  //               predicate: {
  //                 _gt: 0,
  //               },
  //             },
  //           },
  //         },
  //       }),
  //     )
  //     .with('tilt-series-alignment', () =>
  //       where.push({
  //         runs: {
  //           tiltseries: {
  //             https_alignment_file: {
  //               _is_null: false,
  //             },
  //           },
  //         },
  //       }),
  //     )
  //     .with('tomogram', () =>
  //       where.push({
  //         runs: {
  //           tomogram_voxel_spacings: {
  //             tomograms_aggregate: {
  //               count: {
  //                 predicate: {
  //                   _gt: 0,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       }),
  //     )
  //     .exhaustive(),
  // )
  // Number of Runs
  // TODO: Implement when available in API.
  // if (filterState.includedContents.numberOfRuns) {
  //   const runCount = +filterState.includedContents.numberOfRuns.slice(1)
  //   where.push({
  //     runs_aggregate: {
  //       count: {
  //         predicate: { _gte: runCount },
  //       },
  //     },
  //   })
  // }

  // Name/ID section:
  // Dataset IDs
  const datasetId = Number(filterState.ids.dataset)
  if (Number.isFinite(datasetId)) {
    where.id = {
      _eq: datasetId,
    }
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
  // Author name filter
  if (filterState.author.name) {
    where.push({
      authors: {
        name: {
          _ilike: `%${filterState.author.name}%`,
        },
      },
    })
  }
  // Author Orcid filter
  if (filterState.author.orcid) {
    where.push({
      authors: {
        orcid: {
          _ilike: `%${filterState.author.orcid}%`,
        },
      },
    })
  }
  // Deposition ID filter
  const depositionId = +(filterState.ids.deposition ?? Number.NaN)
  if (!Number.isNaN(depositionId) && depositionId > 0) {
    idFilters.push({
      runs: {
        tomogram_voxel_spacings: {
          annotations: {
            deposition_id: {
              _eq: depositionId,
            },
          },
        },
      },
    })
  }

  // Sample and experiment condition filters
  const { organismNames } = filterState.sampleAndExperimentConditions

  // Organism name filter
  if (organismNames.length > 0) {
    where.push({
      organism_name: { _in: organismNames },
    })
  }

  // Hardware filters
  // Camera manufacturer filter
  if (filterState.hardware.cameraManufacturer) {
    where.push({
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
    where.push({
      runs: tiltRangeFilter,
    })
  }

  // Tomogram metadata filters
  if (filterState.tomogram.fiducialAlignmentStatus) {
    where.push({
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
    where.push({
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
    where.push({
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
    where.push({
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
    where.push({
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

  return { _and: where } as Datasets_Bool_Exp
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

      // Order by dataset title if orderBy is set, otherwise order by release date
      orderBy: orderBy
        ? { title: orderBy }
        : {
            release_date: Order_By.Desc,
          },
    },
  })

  const end = performance.now()
  // eslint-disable-next-line no-console
  console.log(`getBrowseDatasets query perf: ${end - start}ms`)

  return results
}
