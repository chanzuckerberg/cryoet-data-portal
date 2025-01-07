import { diff } from 'deep-object-diff'

import {
  GetDatasetsDataQuery,
  GetDatasetsFilterDataQuery,
} from 'app/__generated__/graphql'
import {
  Annotation_File_Shape_Type_Enum,
  GetDatasetsV2Query,
  Tomogram_Reconstruction_Method_Enum,
} from 'app/__generated_v2__/graphql'

/* eslint-disable no-console, no-param-reassign */
export function logIfHasDiff(
  url: string,
  v1: GetDatasetsDataQuery,
  v1FilterValues: GetDatasetsFilterDataQuery,
  v2: GetDatasetsV2Query,
): void {
  console.log('Checking for datasets query diffs')

  v2 = structuredClone(v2)

  // Counts not used.
  // Create consistent sort order.
  for (const dataset of v2.datasets) {
    for (const annotationsAggregate of dataset.distinctObjectNames!.aggregate ??
      []) {
      delete annotationsAggregate.count
    }
    dataset.distinctObjectNames!.aggregate!.sort((groupA, groupB) =>
      String(groupA.groupBy!.annotations!.objectName).localeCompare(
        String(groupB.groupBy!.annotations!.objectName),
      ),
    )
  }
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

  const v1Transformed: GetDatasetsV2Query = {
    datasets: v1.datasets.map((dataset) => ({
      id: dataset.id,
      title: dataset.title,
      organismName: dataset.organism_name,
      datasetPublications: dataset.dataset_publications,
      keyPhotoThumbnailUrl: dataset.key_photo_thumbnail_url,
      relatedDatabaseEntries: dataset.related_database_entries,
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
        aggregate: [
          {
            count: dataset.runs_aggregate.aggregate!.count,
          },
        ],
      },
      distinctObjectNames: {
        aggregate: [
          ...new Set(
            dataset.runs.flatMap((run) =>
              run.tomogram_voxel_spacings.flatMap((voxelSpacing) =>
                voxelSpacing.annotations.map(
                  (annotation) => annotation.object_name,
                ),
              ),
            ),
          ),
        ]
          .map((distinctObjectName) => ({
            groupBy: {
              annotations: {
                objectName: distinctObjectName,
              },
            },
          }))
          .sort((groupA, groupB) =>
            groupA.groupBy.annotations.objectName.localeCompare(
              groupB.groupBy.annotations.objectName,
            ),
          ),
      },
    })),
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
            reconstructionMethod:
              reconstructionMethod.reconstruction_method as Tomogram_Reconstruction_Method_Enum,
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
