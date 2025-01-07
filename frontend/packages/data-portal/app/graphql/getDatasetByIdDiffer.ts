import { diff } from 'deep-object-diff'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'
import {
  Annotation_File_Shape_Type_Enum,
  GetDatasetByIdV2Query,
  Sample_Type_Enum,
  Tiltseries_Microscope_Manufacturer_Enum,
} from 'app/__generated_v2__/graphql'

/* eslint-disable no-console, no-param-reassign */
export function logIfHasDiff(
  url: string,
  v1: GetDatasetByIdQuery,
  v2: GetDatasetByIdV2Query,
): void {
  console.log('Checking for dataset query diffs')

  v2 = structuredClone(v2)

  // Counts not used.
  for (const run of v2.runs) {
    for (const annotationsAggregate of run.annotationsAggregate?.aggregate ??
      []) {
      delete annotationsAggregate.count
    }
    // Consistent sort order.
    run.annotationsAggregate?.aggregate?.sort((groupA, groupB) =>
      String(groupA.groupBy!.objectName).localeCompare(
        String(groupB.groupBy!.objectName),
      ),
    )
  }
  for (const annotationsAggreate of v2.annotationsAggregate.aggregate ?? []) {
    delete annotationsAggreate.count
  }
  for (const annotationShapesAggregate of v2.annotationShapesAggregate
    .aggregate ?? []) {
    delete annotationShapesAggregate.count
  }
  for (const tiltseriesAggregate of v2.tiltseriesAggregate.aggregate ?? []) {
    delete tiltseriesAggregate.count
  }
  // Consistent sort order.
  v2.annotationsAggregate.aggregate?.sort((groupA, groupB) =>
    String(groupA.groupBy!.objectName).localeCompare(
      String(groupB.groupBy!.objectName),
    ),
  )
  v2.annotationShapesAggregate.aggregate?.sort((groupA, groupB) =>
    String(groupA.groupBy!.shapeType).localeCompare(
      String(groupB.groupBy!.shapeType),
    ),
  )
  v2.tiltseriesAggregate.aggregate?.sort(
    (groupA, groupB) =>
      Number(groupA.groupBy!.tiltSeriesQuality) -
      Number(groupB.groupBy!.tiltSeriesQuality),
  )

  const v1Transformed: GetDatasetByIdV2Query = {
    datasets: v1.datasets.map((dataset) => ({
      s3Prefix: dataset.s3_prefix,
      keyPhotoUrl: dataset.key_photo_url,
      lastModifiedDate: `${dataset.last_modified_date}T00:00:00+00:00`,
      releaseDate: `${dataset.release_date}T00:00:00+00:00`,
      depositionDate: `${dataset.deposition_date}T00:00:00+00:00`,
      id: dataset.id,
      title: dataset.title,
      description: dataset.description,
      fundingSources: {
        edges: dataset.funding_sources.map((source) => ({
          node: {
            fundingAgencyName: source.funding_agency_name,
            grantId: source.grant_id,
          },
        })),
      },
      cellComponentName: dataset.cell_component_name,
      cellComponentId: dataset.cell_component_id,
      cellName: dataset.cell_name,
      cellStrainName: dataset.cell_strain_name,
      cellStrainId: dataset.cell_strain_id,
      cellTypeId: dataset.cell_type_id,
      gridPreparation: dataset.grid_preparation,
      organismName: dataset.organism_name,
      organismTaxid:
        dataset.organism_taxid != null
          ? Number(dataset.organism_taxid)
          : dataset.organism_taxid,
      otherSetup: dataset.other_setup,
      samplePreparation: dataset.sample_preparation,
      sampleType: dataset.sample_type as Sample_Type_Enum,
      tissueName: dataset.tissue_name,
      tissueId: dataset.tissue_id,
      authors: {
        edges: dataset.authors.map((author) => ({
          node: {
            correspondingAuthorStatus: author.corresponding_author_status,
            email: author.email,
            name: author.name,
            orcid: author.orcid,
            primaryAuthorStatus: author.primary_author_status,
          },
        })),
      },
      authorsWithAffiliation: {
        edges: dataset.authors_with_affiliation.map((author) => ({
          node: {
            name: author.name,
            affiliationName: author.affiliation_name,
          },
        })),
      },
      relatedDatabaseEntries: dataset.related_database_entries,
      datasetPublications: dataset.dataset_publications,
      runMetadata: {
        edges: dataset.run_metadata.map((run) => ({
          node: {
            tiltseries: {
              edges: run.tiltseries.map((tiltseries) => ({
                node: {
                  accelerationVoltage: tiltseries.acceleration_voltage,
                  sphericalAberrationConstant:
                    tiltseries.spherical_aberration_constant,
                  microscopeManufacturer:
                    tiltseries.microscope_manufacturer as Tiltseries_Microscope_Manufacturer_Enum,
                  microscopeModel: tiltseries.microscope_model,
                  microscopeEnergyFilter: tiltseries.microscope_energy_filter,
                  microscopePhasePlate: tiltseries.microscope_phase_plate,
                  microscopeImageCorrector:
                    tiltseries.microscope_image_corrector,
                  microscopeAdditionalInfo:
                    tiltseries.microscope_additional_info,
                  cameraManufacturer: tiltseries.camera_manufacturer,
                  cameraModel: tiltseries.camera_model,
                },
              })),
            },
          },
        })),
      },
      runsAggregate: {
        aggregate: [
          {
            count: dataset.runs_aggregate.aggregate?.count,
          },
        ],
      },
      filteredRunsCount: {
        aggregate: [
          {
            count: dataset.filtered_runs_count.aggregate?.count,
          },
        ],
      },
    })),
    runs: v1.datasets[0].runs.map((run) => ({
      id: run.id,
      name: run.name,
      tiltseriesAggregate: {
        aggregate: [
          {
            avg: {
              tiltSeriesQuality:
                run.tiltseries_aggregate.aggregate?.avg?.tilt_series_quality,
            },
          },
        ],
      },
      annotationsAggregate: {
        aggregate: [
          ...new Set(
            run.tomogram_voxel_spacings.flatMap((tomogramVoxelSpacing) =>
              tomogramVoxelSpacing.annotations.map(
                (annotation) => annotation.object_name,
              ),
            ),
          ),
        ]
          .map((uniqueObjectName) => ({
            groupBy: {
              objectName: uniqueObjectName,
            },
          }))
          .sort((groupA, groupB) =>
            groupA.groupBy.objectName.localeCompare(groupB.groupBy.objectName),
          ),
      },
      tomograms: {
        edges: run.tomogram_voxel_spacings
          .flatMap((tvs) => tvs.tomograms)
          .filter((tomogram) => tomogram.neuroglancer_config)
          .map((tomogram) => ({
            node: {
              id: tomogram.id,
              keyPhotoThumbnailUrl: tomogram.key_photo_thumbnail_url,
              neuroglancerConfig: tomogram.neuroglancer_config,
            },
          })),
      },
    })),
    annotationsAggregate: {
      aggregate: [
        ...new Set(
          v1.datasets[0].run_stats.flatMap((run) =>
            run.tomogram_voxel_spacings.flatMap((tomogramVoxelSpacing) =>
              tomogramVoxelSpacing.annotations.map(
                (annotation) => annotation.object_name,
              ),
            ),
          ),
        ),
      ]
        .map((uniqueObjectName) => ({
          groupBy: {
            objectName: uniqueObjectName,
          },
        }))
        .sort((groupA, groupB) =>
          groupA.groupBy.objectName.localeCompare(groupB.groupBy.objectName),
        ),
    },
    annotationShapesAggregate: {
      aggregate: [
        ...new Set(
          v1.datasets[0].run_stats.flatMap((run) =>
            run.tomogram_voxel_spacings.flatMap((tomogramVoxelSpacing) =>
              tomogramVoxelSpacing.annotations.flatMap((annotation) =>
                annotation.files.map((file) => file.shape_type),
              ),
            ),
          ),
        ),
      ]
        .map((uniqueShapeType) => ({
          groupBy: {
            shapeType: uniqueShapeType as Annotation_File_Shape_Type_Enum,
          },
        }))
        .sort((groupA, groupB) =>
          groupA.groupBy.shapeType.localeCompare(groupB.groupBy.shapeType),
        ),
    },
    tiltseriesAggregate: {
      aggregate: [
        ...new Set(
          v1.datasets[0].run_stats.flatMap((run) =>
            run.tiltseries.map((tiltseries) => tiltseries.tilt_series_quality),
          ),
        ),
      ]
        .map((uniqueObjectName) => ({
          groupBy: {
            tiltSeriesQuality: uniqueObjectName,
          },
        }))
        .sort(
          (groupA, groupB) =>
            groupA.groupBy.tiltSeriesQuality - groupB.groupBy.tiltSeriesQuality,
        ),
    },
    depositions:
      v1.deposition != null
        ? [
            {
              id: v1.deposition.id,
              title: v1.deposition.title,
            },
          ]
        : [],
  }

  const diffObject = diff(v1Transformed, v2)

  if (Object.keys(diffObject).length > 0) {
    console.log(
      `DIFF AT ${url} ================================================================================ ${JSON.stringify(
        v1Transformed,
      )} ================================================================================ ${JSON.stringify(
        v2,
      )}`,
    )
  }
}
