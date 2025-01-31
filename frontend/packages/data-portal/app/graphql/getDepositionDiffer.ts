import { diff } from 'deep-object-diff'

import {
  GetDatasetsFilterDataQuery,
  GetDepositionByIdQuery,
} from 'app/__generated__/graphql'
import {
  Annotation_File_Shape_Type_Enum,
  Annotation_Method_Link_Type_Enum,
  Annotation_Method_Type_Enum,
  GetDepositionByIdV2Query,
} from 'app/__generated_v2__/graphql'
import { MethodLinkDataType } from 'app/components/Deposition/MethodLinks/type'

import { convertReconstructionMethodToV2, removeTypenames } from './common'

/* eslint-disable no-console, no-param-reassign */
export function logIfHasDiff(
  url: string,
  v1: GetDepositionByIdQuery,
  v1FilterValues: GetDatasetsFilterDataQuery,
  v1AnnotationMethodCounts: Map<string, number>,
  v2: GetDepositionByIdV2Query,
): void {
  console.log(
    `Checking for deposition query diffs ${new Date().toLocaleString()}`,
  )

  v2 = structuredClone(v2)
  removeTypenames(v2)

  // Condense per dataset annotation aggregates into single run where the first aggregate has the
  // count of all groups and all other counts are 0. The V1 counts are grouped by
  // tomogram_voxel_spacings, and it's impossible to compare the runs with the fields being
  // selected.
  for (const dataset of v2.datasets) {
    dataset.runs.edges = [
      {
        node: {
          annotationsAggregate: {
            aggregate: [
              ...new Set(
                dataset.runs.edges.flatMap((run) =>
                  run.node.annotationsAggregate!.aggregate!.map(
                    (group) => group.groupBy!.objectName,
                  ),
                ),
              ),
            ]
              .sort((objectNameA, objectNameB) =>
                String(objectNameA).localeCompare(String(objectNameB)),
              )
              .map((objectName, i) => ({
                count:
                  i === 0
                    ? dataset.runs.edges.reduce(
                        (sumPerRun, nextRun) =>
                          sumPerRun +
                          nextRun.node.annotationsAggregate!.aggregate!.reduce(
                            (sumPerGroup, nextGroup) =>
                              sumPerGroup + nextGroup.count!,
                            0,
                          ),
                        0,
                      )
                    : 0,
                groupBy: {
                  objectName,
                },
              })),
          },
        },
      },
    ]
  }
  // Counts not used.
  // Create consistent sort order.
  v2.depositions[0].annotationMethodCounts!.aggregate!.sort((groupA, groupB) =>
    String(groupA.groupBy!.annotationMethod).localeCompare(
      String(groupB.groupBy!.annotationMethod),
    ),
  )
  for (const group of v2.depositions[0]
    .annotationMethodAndMethodLinksCombinations!.aggregate!) {
    delete group.count
  }
  v2.depositions[0].annotationMethodAndMethodLinksCombinations!.aggregate!.sort(
    (groupA, groupB) =>
      groupA.groupBy!.annotationMethod !== groupB.groupBy!.annotationMethod
        ? String(groupA.groupBy!.annotationMethod).localeCompare(
            String(groupB.groupBy!.annotationMethod),
          )
        : String(groupA.groupBy!.methodLinks!.link).localeCompare(
            String(groupB.groupBy!.methodLinks!.link),
          ),
  )
  v2.datasets.sort(
    (datasetA, datasetB) => datasetA.title.localeCompare(datasetB.title), // V1 and V2 sort by title length differently.
  )
  for (const group of v2.distinctOrganismNames.aggregate!) {
    delete group.count
  }
  v2.distinctOrganismNames.aggregate!.sort((groupA, groupB) =>
    String(groupA.groupBy!.organismName).localeCompare(
      String(groupB.groupBy!.organismName),
    ),
  )
  for (const group of v2.distinctCameraManufacturers.aggregate!) {
    delete group.count
  }
  v2.distinctCameraManufacturers.aggregate!.sort((groupA, groupB) =>
    String(groupA.groupBy!.cameraManufacturer).localeCompare(
      String(groupB.groupBy!.cameraManufacturer),
    ),
  )
  for (const group of v2.distinctReconstructionMethods.aggregate!) {
    delete group.count
  }
  v2.distinctReconstructionMethods.aggregate!.sort((groupA, groupB) =>
    String(groupA.groupBy!.reconstructionMethod).localeCompare(
      String(groupB.groupBy!.reconstructionMethod),
    ),
  )
  for (const group of v2.distinctReconstructionSoftwares.aggregate!) {
    delete group.count
  }
  v2.distinctReconstructionSoftwares.aggregate =
    v2.distinctReconstructionSoftwares.aggregate!.sort((groupA, groupB) =>
      String(groupA.groupBy!.reconstructionSoftware).localeCompare(
        String(groupB.groupBy!.reconstructionSoftware),
      ),
    )
  for (const group of v2.distinctObjectNames.aggregate!) {
    delete group.count
  }
  v2.distinctObjectNames.aggregate!.sort((groupA, groupB) =>
    String(groupA.groupBy!.objectName).localeCompare(
      String(groupB.groupBy!.objectName),
    ),
  )
  for (const group of v2.distinctShapeTypes.aggregate!) {
    delete group.count
  }
  v2.distinctShapeTypes.aggregate!.sort((groupA, groupB) =>
    String(groupA.groupBy!.shapeType).localeCompare(
      String(groupB.groupBy!.shapeType),
    ),
  )

  const v1Transformed: GetDepositionByIdV2Query = {
    depositions: [
      {
        depositionDate: `${v1.deposition!.deposition_date}T00:00:00+00:00`,
        depositionPublications: v1.deposition!.deposition_publications,
        description: v1.deposition!.description,
        id: v1.deposition!.id,
        keyPhotoUrl: v1.deposition!.key_photo_url,
        lastModifiedDate: `${v1.deposition!.last_modified_date}T00:00:00+00:00`,
        relatedDatabaseEntries: v1.deposition!.related_database_entries,
        releaseDate: `${v1.deposition!.release_date}T00:00:00+00:00`,
        title: v1.deposition!.title,
        authors: {
          edges: v1.deposition!.authors.map((author) => ({
            node: {
              correspondingAuthorStatus: author.corresponding_author_status,
              email: author.email,
              name: author.name,
              orcid: author.orcid,
              primaryAuthorStatus: author.primary_author_status,
            },
          })),
        },
        // Platformics returns an empty array if the count is 0.
        annotationsAggregate: {
          aggregate:
            v1.deposition!.annotations_aggregate.aggregate?.count !== 0
              ? [
                  {
                    count:
                      v1.deposition!.annotations_aggregate.aggregate!.count,
                  },
                ]
              : [],
        },
        annotationMethodCounts: {
          aggregate: [...v1AnnotationMethodCounts.entries()]
            .sort(([annotationMethodA], [annotationMethodB]) =>
              String(annotationMethodA).localeCompare(
                String(annotationMethodB),
              ),
            )
            .map(([annotationMethod, count]) => ({
              count,
              groupBy: {
                annotationMethod,
              },
            })),
        },
        annotationMethodAndMethodLinksCombinations: {
          aggregate: v1
            .deposition!.annotation_methods.flatMap((annotation) =>
              (annotation.method_links as MethodLinkDataType[]).map(
                (methodLink) => ({
                  groupBy: {
                    annotationMethod: annotation.annotation_method,
                    methodType:
                      annotation.method_type as Annotation_Method_Type_Enum,
                    methodLinks: {
                      link: methodLink.link,
                      linkType:
                        methodLink.link_type as Annotation_Method_Link_Type_Enum,
                      name: methodLink.custom_name,
                    },
                  },
                }),
              ),
            )
            .sort((groupA, groupB) =>
              groupA.groupBy.annotationMethod !==
              groupB.groupBy.annotationMethod
                ? String(groupA.groupBy.annotationMethod).localeCompare(
                    String(groupB.groupBy.annotationMethod),
                  )
                : String(groupA.groupBy.methodLinks.link).localeCompare(
                    String(groupB.groupBy.methodLinks.link),
                  ),
            ),
        },
      },
    ],
    datasets: v1.datasets
      .map((dataset) => ({
        id: dataset.id,
        title: dataset.title,
        organismName: dataset.organism_name,
        keyPhotoThumbnailUrl: dataset.key_photo_thumbnail_url,
        authors: {
          edges: dataset.authors.map((author) => ({
            node: {
              name: author.name,
              primaryAuthorStatus: author.primary_author_status,
              correspondingAuthorStatus: author.corresponding_author_status,
            },
          })),
        },
        runsCount: {
          aggregate:
            dataset.runs_aggregate.aggregate!.count !== 0
              ? [
                  {
                    count: dataset.runs_aggregate.aggregate!.count,
                  },
                ]
              : [],
        },
        runs: {
          edges: [
            {
              node: {
                annotationsAggregate: {
                  aggregate: [
                    ...new Set(
                      dataset.runs.flatMap((run) =>
                        run.tomogram_voxel_spacings.flatMap(
                          (tomogramVoxelSpacing) =>
                            tomogramVoxelSpacing.annotations.map(
                              (annotation) => annotation.object_name,
                            ),
                        ),
                      ),
                    ),
                  ]
                    .sort((objectNameA, objectNameB) =>
                      String(objectNameA).localeCompare(String(objectNameB)),
                    )
                    .map((objectName, i) => ({
                      count:
                        i === 0
                          ? dataset.runs.reduce(
                              (sumPerRun, nextRun) =>
                                sumPerRun +
                                nextRun.tomogram_voxel_spacings.reduce(
                                  (
                                    sumPerTomogramVoxelSpacing,
                                    nextTomogramVoxelSpacing,
                                  ) =>
                                    sumPerTomogramVoxelSpacing +
                                    nextTomogramVoxelSpacing
                                      .annotations_aggregate.aggregate!.count,
                                  0,
                                ),
                              0,
                            )
                          : 0,
                      groupBy: {
                        objectName,
                      },
                    })),
                },
              },
            },
          ],
        },
      }))
      .sort((datasetA, datasetB) =>
        datasetA.title.localeCompare(datasetB.title),
      ),
    totalDatasetsCount: {
      aggregate: [
        {
          count: v1.datasets_aggregate.aggregate!.count,
        },
      ],
    },
    filteredDatasetsCount: {
      aggregate: [
        {
          count: v1.filtered_datasets_aggregate.aggregate!.count,
        },
      ],
    },
    distinctOrganismNames: {
      aggregate: v1FilterValues.organism_names
        .map((organismName) => ({
          groupBy: {
            organismName: organismName.organism_name,
          },
        }))
        .sort((groupA, groupB) =>
          String(groupA.groupBy.organismName).localeCompare(
            String(groupB.groupBy.organismName),
          ),
        ),
    },
    distinctCameraManufacturers: {
      aggregate: v1FilterValues.camera_manufacturers
        .map((cameraManufacturer) => ({
          groupBy: {
            cameraManufacturer: cameraManufacturer.camera_manufacturer,
          },
        }))
        .sort((groupA, groupB) =>
          groupA.groupBy.cameraManufacturer.localeCompare(
            groupB.groupBy.cameraManufacturer,
          ),
        ),
    },
    distinctReconstructionMethods: {
      aggregate: v1FilterValues.reconstruction_methods
        .map((reconstructionMethod) => ({
          groupBy: {
            reconstructionMethod: convertReconstructionMethodToV2(
              reconstructionMethod.reconstruction_method,
            ),
          },
        }))
        .sort((groupA, groupB) =>
          groupA.groupBy.reconstructionMethod.localeCompare(
            groupB.groupBy.reconstructionMethod,
          ),
        ),
    },
    distinctReconstructionSoftwares: {
      aggregate: v1FilterValues.reconstruction_softwares
        .map((reconstructionSoftware) => ({
          groupBy: {
            reconstructionSoftware:
              reconstructionSoftware.reconstruction_software,
          },
        }))
        .sort((groupA, groupB) =>
          groupA.groupBy.reconstructionSoftware.localeCompare(
            groupB.groupBy.reconstructionSoftware,
          ),
        ),
    },
    distinctObjectNames: {
      aggregate: v1FilterValues.object_names
        .map((objectName) => ({
          groupBy: {
            objectName: objectName.object_name,
          },
        }))
        .sort((groupA, groupB) =>
          groupA.groupBy.objectName.localeCompare(groupB.groupBy.objectName),
        ),
    },
    distinctShapeTypes: {
      aggregate: v1FilterValues.object_shape_types
        .map((shapeType) => ({
          groupBy: {
            shapeType: shapeType.shape_type as Annotation_File_Shape_Type_Enum,
          },
        }))
        .sort((groupA, groupB) =>
          groupA.groupBy.shapeType.localeCompare(groupB.groupBy.shapeType),
        ),
    },
  }

  const diffObject = diff(v1Transformed, v2)

  if (Object.keys(diffObject).length > 0) {
    console.log(
      `DIFF AT ${url} ================================================================================ ${JSON.stringify(
        v1Transformed,
      )} ================================================================================================================================================================================================================================================================================================================================ ${JSON.stringify(
        v2,
      )}`,
    )
  }
}
