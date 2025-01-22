import { diff } from 'deep-object-diff'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import {
  Annotation_File_Shape_Type_Enum,
  Annotation_Method_Type_Enum,
  Fiducial_Alignment_Status_Enum,
  GetRunByIdV2Query,
  Sample_Type_Enum,
  Tiltseries_Microscope_Manufacturer_Enum,
  Tomogram_Processing_Enum,
  Tomogram_Reconstruction_Method_Enum,
} from 'app/__generated_v2__/graphql'

/* eslint-disable no-console, no-param-reassign, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return */
export function logIfHasDiff(
  url: string,
  v1: GetRunByIdQuery,
  v2: GetRunByIdV2Query,
): void {
  console.log('Checking for run query diffs')

  v2 = structuredClone(v2)
  // There are no alignments in V1.
  delete v2.alignmentsAggregate.aggregate
  for (const annotationShape of v2.annotationShapes) {
    // There are no alignments in V1.
    for (const annotationFile of annotationShape.annotationFiles.edges) {
      delete annotationFile.node.alignmentId
    }
    // Sort annotation files for consistency.
    annotationShape.annotationFiles.edges.sort(
      (annotationFileA, annotationFileB) =>
        annotationFileA.node.format.localeCompare(annotationFileB.node.format),
    )
    // Sort method links for consistency.
    annotationShape.annotation?.methodLinks.edges.sort(
      (methodLinkA, methodLinkB) =>
        methodLinkA.node.link.localeCompare(methodLinkB.node.link),
    )
  }
  // Tomograms are currently being sorted by the FE.
  v2.tomograms.sort((tomogramA, tomogramB) => tomogramB.id - tomogramA.id)
  for (const tomogram of v2.tomograms) {
    // Delete fields that don't exist in V1.
    delete tomogram.alignment
    delete tomogram.isVisualizationDefault
    delete tomogram.releaseDate
    delete tomogram.lastModifiedDate
    delete tomogram.relatedDatabaseEntries
    delete tomogram.deposition
    // Standard tomograms are V2 only.
    tomogram.isPortalStandard = false
    // Authors are sorted on the FE.
    tomogram.authors.edges.sort((authorA, authorB) =>
      authorA.node.name.localeCompare(authorB.node.name),
    )
  }
  for (const run of v2.runs) {
    // There are no frames in V1.
    delete run.framesAggregate
  }
  // Don't care about counts.
  for (const aggregate of v2.uniqueAnnotationSoftwares.aggregate ?? []) {
    delete aggregate.count
  }
  for (const aggregate of v2.uniqueObjectNames.aggregate ?? []) {
    delete aggregate.count
  }
  for (const aggregate of v2.uniqueShapeTypes.aggregate ?? []) {
    delete aggregate.count
  }
  for (const aggregate of v2.uniqueResolutions.aggregate ?? []) {
    delete aggregate.count
  }
  for (const aggregate of v2.uniqueProcessingMethods.aggregate ?? []) {
    delete aggregate.count
  }
  // Consistent sort order.
  v2.uniqueAnnotationSoftwares.aggregate?.sort((gropuByA, groupByB) =>
    String(gropuByA.groupBy!.annotationSoftware).localeCompare(
      String(groupByB.groupBy!.annotationSoftware),
    ),
  )
  v2.uniqueObjectNames.aggregate?.sort((groupA, groupB) =>
    String(groupA.groupBy!.objectName).localeCompare(
      String(groupB.groupBy!.objectName),
    ),
  )
  v2.uniqueShapeTypes.aggregate?.sort((groupA, groupB) =>
    String(groupA.groupBy!.shapeType).localeCompare(
      String(groupB.groupBy!.shapeType),
    ),
  )
  v2.uniqueResolutions.aggregate?.sort(
    (groupA, groupB) =>
      Number(groupA.groupBy!.voxelSpacing) -
      Number(groupB.groupBy!.voxelSpacing),
  )
  v2.uniqueProcessingMethods.aggregate?.sort((groupA, groupB) =>
    String(groupA.groupBy!.processing).localeCompare(
      String(groupB.groupBy!.processing),
    ),
  )

  const v1Transformed: GetRunByIdV2Query = {
    runs: v1.runs.map((run) => ({
      id: run.id,
      name: run.name,
      tiltseries: {
        edges: run.tiltseries.map((runTiltseries) => ({
          node: {
            accelerationVoltage: runTiltseries.acceleration_voltage,
            alignedTiltseriesBinning: runTiltseries.aligned_tiltseries_binning,
            binningFromFrames: runTiltseries.binning_from_frames,
            cameraManufacturer: runTiltseries.camera_manufacturer,
            cameraModel: runTiltseries.camera_model,
            dataAcquisitionSoftware: runTiltseries.data_acquisition_software,
            id: runTiltseries.id,
            isAligned: runTiltseries.is_aligned,
            microscopeAdditionalInfo: runTiltseries.microscope_additional_info,
            microscopeEnergyFilter: runTiltseries.microscope_energy_filter,
            microscopeImageCorrector: runTiltseries.microscope_image_corrector,
            microscopeManufacturer:
              runTiltseries.microscope_manufacturer as Tiltseries_Microscope_Manufacturer_Enum,
            microscopeModel: runTiltseries.microscope_model,
            microscopePhasePlate: runTiltseries.microscope_phase_plate,
            pixelSpacing: runTiltseries.pixel_spacing!,
            relatedEmpiarEntry: runTiltseries.related_empiar_entry,
            sphericalAberrationConstant:
              runTiltseries.spherical_aberration_constant,
            tiltAxis: runTiltseries.tilt_axis,
            tiltMax: runTiltseries.tilt_max,
            tiltMin: runTiltseries.tilt_min,
            tiltRange: runTiltseries.tilt_range,
            tiltSeriesQuality: runTiltseries.tilt_series_quality,
            tiltStep: runTiltseries.tilt_step,
            tiltingScheme: runTiltseries.tilting_scheme,
            totalFlux: runTiltseries.total_flux,
          },
        })),
      },
      dataset: {
        cellComponentName: run.dataset.cell_component_name,
        cellComponentId: run.dataset.cell_component_id,
        cellName: run.dataset.cell_name,
        cellStrainName: run.dataset.cell_strain_name,
        cellStrainId: run.dataset.cell_strain_id,
        cellTypeId: run.dataset.cell_type_id,
        depositionDate: `${run.dataset.deposition_date}T00:00:00+00:00`,
        description: run.dataset.description,
        gridPreparation: run.dataset.grid_preparation,
        id: run.dataset.id,
        lastModifiedDate: `${run.dataset.last_modified_date}T00:00:00+00:00`,
        organismName: run.dataset.organism_name!,
        organismTaxid:
          run.dataset.organism_taxid != null
            ? Number(run.dataset.organism_taxid)
            : run.dataset.organism_taxid,
        otherSetup: run.dataset.other_setup,
        datasetPublications: run.dataset.dataset_publications,
        relatedDatabaseEntries: run.dataset.related_database_entries,
        releaseDate: `${run.dataset.release_date}T00:00:00+00:00`,
        s3Prefix: run.dataset.s3_prefix,
        samplePreparation: run.dataset.sample_preparation,
        sampleType: run.dataset.sample_type as Sample_Type_Enum,
        tissueName: run.dataset.tissue_name,
        tissueId: run.dataset.tissue_id,
        title: run.dataset.title,
        fundingSources: {
          edges: run.dataset.funding_sources.map((source) => ({
            node: {
              fundingAgencyName: source.funding_agency_name,
              grantId: source.grant_id,
            },
          })),
        },
        authors: {
          edges: run.dataset.authors.map((author) => ({
            node: {
              correspondingAuthorStatus: author.corresponding_author_status,
              email: author.email,
              name: author.name,
              orcid: author.orcid,
              primaryAuthorStatus: author.primary_author_status,
            },
          })),
        },
      },
      tomogramVoxelSpacings: {
        edges: run.tomogram_voxel_spacings.map((tomogramVoxelSpacing) => ({
          node: {
            id: tomogramVoxelSpacing.id,
            s3Prefix: tomogramVoxelSpacing.s3_prefix!,
            tomograms: {
              edges: tomogramVoxelSpacing.tomograms.map((tomogram) => ({
                node: {
                  ctfCorrected: Boolean(tomogram.ctf_corrected),
                  fiducialAlignmentStatus:
                    tomogram.fiducial_alignment_status as Fiducial_Alignment_Status_Enum,
                  id: tomogram.id,
                  keyPhotoUrl: tomogram.key_photo_url,
                  name: tomogram.name,
                  neuroglancerConfig: tomogram.neuroglancer_config,
                  processing: tomogram.processing as Tomogram_Processing_Enum,
                  processingSoftware: tomogram.processing_software,
                  reconstructionMethod: (tomogram.reconstruction_method ===
                  'Weighted back projection'
                    ? 'WBP'
                    : tomogram.reconstruction_method) as Tomogram_Reconstruction_Method_Enum,
                  reconstructionSoftware: tomogram.reconstruction_software,
                  sizeX: tomogram.size_x,
                  sizeY: tomogram.size_y,
                  sizeZ: tomogram.size_z,
                  voxelSpacing: tomogram.voxel_spacing,
                  alignment: {
                    affineTransformationMatrix: JSON.stringify(
                      tomogram.affine_transformation_matrix,
                    )
                      .replaceAll(',', ', ')
                      // TODO: Remove when BE bug fixed.
                      .replaceAll('{', '[')
                      .replaceAll('}', ']'),
                  },
                },
              })),
            },
          },
        })),
        tiltseriesAggregate: {
          aggregate:
            // Platformics returns an empty array if the count is 0.
            run.tiltseries_aggregate.aggregate!.count === 0
              ? [
                  {
                    count: run.tiltseries_aggregate.aggregate?.count,
                    avg: {
                      tiltSeriesQuality:
                        run.tiltseries_aggregate.aggregate?.avg
                          ?.tilt_series_quality,
                    },
                  },
                ]
              : [],
        },
      },
    })),
    alignmentsAggregate: {},
    annotationShapes: v1.annotation_files.map((file) => ({
      shapeType: file.shape_type as Annotation_File_Shape_Type_Enum,
      annotationFiles: {
        edges: file.annotation.files
          .filter((nestedFile) => nestedFile.shape_type === file.shape_type)
          .map((nestedFile) => ({
            node: {
              format: nestedFile.format,
              httpsPath: nestedFile.https_path,
              s3Path: nestedFile.s3_path,
            },
          }))
          .sort((a, b) => a.node.format.localeCompare(b.node.format)),
      },
      annotation: {
        annotationMethod: file.annotation.annotation_method,
        annotationPublication: file.annotation.annotation_publication,
        annotationSoftware: file.annotation.annotation_software,
        confidencePrecision: file.annotation.confidence_precision,
        confidenceRecall: file.annotation.confidence_recall,
        depositionDate: `${file.annotation.deposition_date}T00:00:00+00:00`,
        groundTruthStatus: file.annotation.ground_truth_status,
        groundTruthUsed: file.annotation.ground_truth_used,
        id: file.annotation.id,
        isCuratorRecommended: file.annotation.is_curator_recommended,
        lastModifiedDate: `${file.annotation.last_modified_date}T00:00:00+00:00`,
        methodLinks: {
          edges:
            file.annotation.method_links
              ?.map((methodLink: any) => ({
                node: {
                  link: methodLink.link,
                  linkType: methodLink.link_type,
                  name: methodLink.custom_name,
                },
              }))
              .sort(
                (methodLinkA: any, methodLinkB: any) =>
                  methodLinkA.node.link?.localeCompare(methodLinkB.node.link),
              ) ?? [],
        },
        methodType: file.annotation.method_type as Annotation_Method_Type_Enum,
        objectCount: file.annotation.object_count,
        objectDescription: file.annotation.object_description,
        objectId: file.annotation.object_id,
        objectName: file.annotation.object_name,
        objectState: file.annotation.object_state,
        releaseDate: `${file.annotation.release_date}T00:00:00+00:00`,
        authors: {
          edges: file.annotation.authors.map((author) => ({
            node: {
              primaryAuthorStatus: author.primary_author_status ?? false,
              correspondingAuthorStatus: author.corresponding_author_status,
              name: author.name,
              email: author.email,
              orcid: author.orcid,
            },
          })),
        },
        authorsAggregate: {
          aggregate: [
            {
              count: file.annotation.authors_aggregate.aggregate?.count,
            },
          ],
        },
        deposition: {
          id: file.annotation.deposition!.id ?? 0,
          title: file.annotation.deposition!.title,
        },
      },
    })),
    tomograms: v1.tomograms
      .map((tomogram) => ({
        ctfCorrected: Boolean(tomogram.ctf_corrected),
        fiducialAlignmentStatus:
          tomogram.fiducial_alignment_status as Fiducial_Alignment_Status_Enum,
        httpsMrcFile: tomogram.https_mrc_scale0,
        id: tomogram.id,
        isPortalStandard: false,
        isAuthorSubmitted: tomogram.is_canonical,
        keyPhotoThumbnailUrl: tomogram.key_photo_thumbnail_url,
        keyPhotoUrl: tomogram.key_photo_url,
        name: tomogram.name,
        neuroglancerConfig: tomogram.neuroglancer_config,
        processing: tomogram.processing as Tomogram_Processing_Enum,
        processingSoftware: tomogram.processing_software,
        reconstructionMethod: (tomogram.reconstruction_method ===
        'Weighted back projection'
          ? 'WBP'
          : tomogram.reconstruction_method) as Tomogram_Reconstruction_Method_Enum,
        reconstructionSoftware: tomogram.reconstruction_software,
        s3MrcFile: tomogram.s3_mrc_scale0,
        s3OmezarrDir: tomogram.s3_omezarr_dir,
        sizeX: tomogram.size_x,
        sizeY: tomogram.size_y,
        sizeZ: tomogram.size_z,
        voxelSpacing: tomogram.voxel_spacing,
        tomogramVoxelSpacing:
          tomogram.tomogram_voxel_spacing != null
            ? {
                id: tomogram.tomogram_voxel_spacing.id,
                s3Prefix: tomogram.tomogram_voxel_spacing.s3_prefix!,
              }
            : undefined,
        authors: {
          edges: tomogram.authors
            .map((author) => ({
              node: {
                primaryAuthorStatus: author.primary_author_status,
                correspondingAuthorStatus: author.corresponding_author_status,
                name: author.name,
                email: author.email,
                orcid: author.orcid,
              },
            }))
            .sort((authorA, authorB) =>
              authorA.node.name.localeCompare(authorB.node.name),
            ),
        },
      }))
      .sort((tomogramA, tomogramB) => tomogramB.id - tomogramA.id),
    uniqueAnnotationSoftwares: {
      aggregate: v1.annotations_for_softwares
        .map((annotation) => ({
          groupBy: {
            annotationSoftware: annotation.annotation_software,
          },
        }))
        .sort((groupByA, groupByB) =>
          String(groupByA.groupBy.annotationSoftware).localeCompare(
            String(groupByB.groupBy.annotationSoftware),
          ),
        ),
    },
    uniqueObjectNames: {
      aggregate: v1.annotations_for_object_names
        .map((annotation) => ({
          groupBy: {
            objectName: annotation.object_name,
          },
        }))
        .sort((groupA, groupB) =>
          groupA.groupBy.objectName.localeCompare(groupB.groupBy.objectName),
        ),
    },
    uniqueShapeTypes: {
      aggregate: v1.annotation_files_for_shape_types
        .map((file) => ({
          groupBy: {
            shapeType: file.shape_type as Annotation_File_Shape_Type_Enum,
          },
        }))
        .sort((groupA, groupB) =>
          groupA.groupBy.shapeType.localeCompare(groupB.groupBy.shapeType),
        ),
    },
    uniqueResolutions: {
      aggregate: v1.tomograms_for_resolutions.map((tomogram) => ({
        groupBy: {
          voxelSpacing: tomogram.voxel_spacing,
        },
      })),
    },
    uniqueProcessingMethods: {
      aggregate: v1.tomograms_for_distinct_processing_methods.map(
        (tomogram) => ({
          groupBy: {
            processing: tomogram.processing as Tomogram_Processing_Enum,
          },
        }),
      ),
    },
    numTotalAnnotationRows: {
      aggregate: [
        {
          count: v1.annotation_files_aggregate_for_total.aggregate?.count,
        },
      ],
    },
    numFilteredAnnotationRows: {
      aggregate: [
        {
          count: v1.annotation_files_aggregate_for_filtered.aggregate?.count,
        },
      ],
    },
    numFilteredGroundTruthAnnotationRows: {
      aggregate: [
        {
          count:
            v1.annotation_files_aggregate_for_ground_truth.aggregate?.count,
        },
      ],
    },
    numFilteredOtherAnnotationRows: {
      aggregate: [
        {
          count: v1.annotation_files_aggregate_for_other.aggregate?.count,
        },
      ],
    },
    tomogramsAggregate: {
      aggregate: [
        {
          count: v1.tomograms_aggregate.aggregate?.count,
        },
      ],
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
      `DIFF AT ${url} ======================================== ${JSON.stringify(
        v1Transformed,
      )} ================================================================================ ${JSON.stringify(
        v2,
      )}`,
    )
  }
}
