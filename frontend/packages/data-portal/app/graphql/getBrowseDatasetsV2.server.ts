import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { performance } from 'perf_hooks'

import { gql } from 'app/__generated_v2__'
import { OrderBy } from 'app/__generated_v2__/graphql'
import { MAX_PER_PAGE } from 'app/constants/pagination'

const GET_DATASETS_DATA_QUERY = gql(`
  query GetDatasetsDataV2(
    $limit: Int,
    $offset: Int,
    $orderBy: DatasetOrderByClause!,
    $filter: DatasetWhereClause,
  ) {
    datasets(
      limitOffset: {
        limit: $limit,
        offset: $offset,
      }
      orderBy: [$orderBy],
      where: $filter
    ) {
      id
      title
      organismName
      datasetPublications
      keyPhotoThumbnailUrl
      relatedDatabaseEntries

      authors(
        orderBy: {
          authorListOrder: asc,
        },
      ) {
        edges {
          node {
            name
            primaryAuthorStatus
            correspondingAuthorStatus
          }
        }
      }

      runCount: runsAggregate {
        aggregate {
          count
        }
      }

      runs {
        edges {
          node {
            annotationsAggregate {
              aggregate {
                groupBy {
                  objectName
                }
                count
              }
            }
          }
        }
      }
    }

    datasetCount: datasetsAggregate {
      aggregate {
        count
      }
    }

    filteredDatasetCount: datasetsAggregate(where: $filter) {
      aggregate {
        count
      }
    }
  }
`)

// TODO: Finish migrating this once aggregate filtering is enabled in V2

// function getFilter(filterState: FilterState, query: string) {
//   const filters: DatasetWhereClause[] = []

//   // Text search by dataset title
//   if (query) {
//     filters.push({
//       title: {
//         _ilike: `%${query}%`,
//       },
//     })
//   }

//   // Included contents filters
//   // Ground truth filter
//   if (filterState.includedContents.isGroundTruthEnabled) {
//     filters.push({
//       runs: {
//         annotations: {
//           groundTruthStatus: {
//             _eq: true,
//           },
//         },
//       },
//     })
//   }

//   // Available files filter
//   filterState.includedContents.availableFiles.forEach((file) =>
//     match(file)
//       .with('raw-frames', () =>
//         filters.push({
//           runs: {
//             frames: {
//               id: {
//                 _is_null: false,
//               },
//             },
//           },
//         }),
//       )
//       .with('tilt-series', () =>
//         filters.push({
//           runs: {
//             tiltseries: {
//               id: {
//                 _is_null: false,
//               },
//             },
//           },
//         }),
//       )
//       .with('tilt-series-alignment', () =>
//         filters.push({
//           runs: {
//             alignments: {
//               id: {
//                 _is_null: false,
//               },
//             },
//           },
//         }),
//       )
//       .with('tomogram', () =>
//         filters.push({
//           runs: {
//             tomograms: {
//               id: {
//                 _is_null: false,
//               },
//             },
//           },
//         }),
//       )
//       .exhaustive(),
//   )

//   // Number of runs filter
//   if (filterState.includedContents.numberOfRuns) {
//     const runCount = +filterState.includedContents.numberOfRuns.slice(1)
//     filters.push({
//       runs_aggregate: {
//         count: {
//           predicate: { _gte: runCount },
//         },
//       },
//     })
//   }

//   // Id filters
//   const idFilters: DatasetWhereClause[] = []

//   // Dataset ID filter
//   const datasetId = +(filterState.ids.dataset ?? Number.NaN)
//   if (!Number.isNaN(datasetId) && datasetId > 0) {
//     idFilters.push({
//       id: {
//         _eq: datasetId,
//       },
//     })
//   }

//   // Deposition ID filter
//   const depositionId = +(filterState.ids.deposition ?? Number.NaN)
//   if (!Number.isNaN(depositionId) && depositionId > 0) {
//     idFilters.push({
//       runs: {
//         tomogram_voxel_spacings: {
//           annotations: {
//             deposition_id: {
//               _eq: depositionId,
//             },
//           },
//         },
//       },
//     })
//   }

//   // Empiar filter
//   const empiarId = filterState.ids.empiar
//   if (empiarId) {
//     idFilters.push({
//       related_database_entries: {
//         _like: `%EMPIAR-${empiarId}%`,
//       },
//     })
//   }

//   // EMDB filter
//   const emdbId = filterState.ids.emdb
//   if (emdbId) {
//     idFilters.push({
//       related_database_entries: {
//         _like: `%EMD-${emdbId}%`,
//       },
//     })
//   }

//   if (idFilters.length > 0) {
//     filters.push({ _or: idFilters })
//   }

//   // Author filters

//   // Author name filter
//   if (filterState.author.name) {
//     filters.push({
//       authors: {
//         name: {
//           _ilike: `%${filterState.author.name}%`,
//         },
//       },
//     })
//   }

//   // Author Orcid filter
//   if (filterState.author.orcid) {
//     filters.push({
//       authors: {
//         orcid: {
//           _ilike: `%${filterState.author.orcid}%`,
//         },
//       },
//     })
//   }

//   // Sample and experiment condition filters
//   const { organismNames } = filterState.sampleAndExperimentConditions

//   // Organism name filter
//   if (organismNames.length > 0) {
//     filters.push({
//       organism_name: { _in: organismNames },
//     })
//   }

//   // Hardware filters
//   // Camera manufacturer filter
//   if (filterState.hardware.cameraManufacturer) {
//     filters.push({
//       runs: {
//         tiltseries: {
//           camera_manufacturer: {
//             _eq: filterState.hardware.cameraManufacturer,
//           },
//         },
//       },
//     })
//   }

//   // Tilt series metadata filters
//   const tiltRangeFilter = getTiltRangeFilter(
//     filterState.tiltSeries.min,
//     filterState.tiltSeries.max,
//   )

//   if (tiltRangeFilter) {
//     filters.push({
//       runs: tiltRangeFilter,
//     })
//   }

//   // Tomogram metadata filters
//   if (filterState.tomogram.fiducialAlignmentStatus) {
//     filters.push({
//       runs: {
//         tomogram_voxel_spacings: {
//           tomograms: {
//             fiducial_alignment_status: {
//               _eq:
//                 filterState.tomogram.fiducialAlignmentStatus === 'true'
//                   ? 'FIDUCIAL'
//                   : 'NON_FIDUCIAL',
//             },
//           },
//         },
//       },
//     })
//   }

//   // Reconstruction method filter
//   if (filterState.tomogram.reconstructionMethod) {
//     filters.push({
//       runs: {
//         tomogram_voxel_spacings: {
//           tomograms: {
//             reconstruction_method: {
//               _eq: filterState.tomogram.reconstructionMethod,
//             },
//           },
//         },
//       },
//     })
//   }

//   // Reconstruction software filter
//   if (filterState.tomogram.reconstructionSoftware) {
//     filters.push({
//       runs: {
//         tomogram_voxel_spacings: {
//           tomograms: {
//             reconstruction_software: {
//               _eq: filterState.tomogram.reconstructionSoftware,
//             },
//           },
//         },
//       },
//     })
//   }

//   // Annotation filters
//   const { objectNames, objectShapeTypes } = filterState.annotation

//   // Object names filter
//   if (objectNames.length > 0) {
//     filters.push({
//       runs: {
//         tomogram_voxel_spacings: {
//           annotations: {
//             object_name: {
//               _in: objectNames,
//             },
//           },
//         },
//       },
//     })
//   }

//   // Object shape type filter
//   if (objectShapeTypes.length > 0) {
//     filters.push({
//       runs: {
//         tomogram_voxel_spacings: {
//           annotations: {
//             files: {
//               shape_type: {
//                 _in: objectShapeTypes,
//               },
//             },
//           },
//         },
//       },
//     })
//   }

//   return { _and: filters } as DatasetWhereClause
// }

export async function getBrowseDatasetsV2({
  client,
  orderBy,
  page = 1,
  params = new URLSearchParams(),
  query = '',
}: {
  client: ApolloClient<NormalizedCacheObject>
  orderBy?: OrderBy | null
  page?: number
  params?: URLSearchParams
  query?: string
}) {
  // eslint-disable-next-line no-console
  console.log(params, query)

  const start = performance.now()

  const results = await client.query({
    query: GET_DATASETS_DATA_QUERY,
    variables: {
      // filter: getFilter(getFilterState(params), query),
      filter: {},
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,

      // Order by dataset title if orderBy is set, otherwise order by release date
      orderBy: orderBy
        ? { title: orderBy }
        : {
            releaseDate: OrderBy.Desc,
            id: OrderBy.Desc,
          },
    },
  })

  const end = performance.now()
  // eslint-disable-next-line no-console
  console.log(`getBrowseDatasets query perf: ${end - start}ms`)

  return results
}
