import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { E2E_CONFIG, translations } from 'e2e/constants'
import { getObjectShapeTypeLabel } from 'e2e/utils'
import { startCase } from 'lodash-es'
import { DeepPartial } from 'utility-types'

import {
  Annotations,
  Datasets,
  GetRunByIdQuery,
  Tiltseries,
} from 'app/__generated__/graphql'
import {
  Dataset,
  Fiducial_Alignment_Status_Enum,
  Tomogram,
} from 'app/__generated_v2__/graphql'
import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { getRunById } from 'app/graphql/getRunById.server'
import { getRunByIdV2 } from 'app/graphql/getRunByIdV2.server'
import { ObjectShapeType } from 'app/types/shapeTypes'
import { isFiducial } from 'app/utils/tomograms'

import { DrawerTestData, DrawerTestMetadata } from './types'

function getBoolString(value?: boolean): string {
  return value ? 'True' : 'False'
}

function getDatasetTestMetadata({
  dataset,
  type,
}: {
  dataset: DeepPartial<Datasets>
  type: 'dataset' | 'run'
}): DrawerTestMetadata {
  return {
    cellLineOrStrainName: dataset.cell_strain_name,
    cellName: dataset.cell_name,
    cellularComponent: dataset.cell_component_name,
    depositionDate: dataset.deposition_date,
    fundingAgency: dataset?.funding_sources?.map(
      (source) => source?.funding_agency_name ?? '',
    ),
    grantID: dataset.funding_sources?.map((source) => source.grant_id ?? ''),
    gridPreparation: dataset.grid_preparation,
    organismName: dataset.organism_name,
    otherSetup: dataset.other_setup,
    relatedDatabases: dataset.related_database_entries?.split(', ') ?? [],
    samplePreparation: dataset.sample_preparation,
    sampleType: dataset.sample_type,
    tissueName: dataset.tissue_name,

    ...(type === 'run'
      ? {
          description: dataset.description,
          depositionDate: dataset.deposition_date,
          releaseDate: dataset.release_date,
          lastModifiedDate: dataset.last_modified_date,
          authors: dataset.authors?.map((author) => author.name),
        }
      : {}),
  }
}

function getTiltSeriesTestMetadata({
  tiltSeries,
  type,
}: {
  tiltSeries: DeepPartial<Tiltseries>
  type: 'dataset' | 'run'
}): DrawerTestMetadata {
  return {
    accelerationVoltage: tiltSeries.acceleration_voltage,
    sphericalAberrationConstant: tiltSeries.spherical_aberration_constant,
    microscopeManufacturer: tiltSeries.microscope_manufacturer,
    microscopeModel: tiltSeries.microscope_model,
    energyFilter: tiltSeries.microscope_energy_filter,
    phasePlate: tiltSeries.microscope_phase_plate,
    imageCorrector: tiltSeries.microscope_image_corrector ?? 'None',
    additionalMicroscopeOpticalSetup:
      tiltSeries.microscope_additional_info ?? 'None',
    cameraManufacturer: tiltSeries.camera_manufacturer,
    cameraModel: tiltSeries.camera_model,

    ...(type === 'run'
      ? {
          dataAcquisitionSoftware: tiltSeries.data_acquisition_software,
          pixelSpacing: tiltSeries.pixel_spacing,
          tiltAxis: tiltSeries.tilt_axis,
          tiltRange: tiltSeries.tilt_range,
          tiltStep: tiltSeries.tilt_step,
          tiltingScheme: tiltSeries.tilting_scheme,
          totalFlux: tiltSeries.total_flux,
          bingingFromFrames: tiltSeries.binning_from_frames,
          seriesIsAligned: getBoolString(tiltSeries.is_aligned),
          relatedEmpiarEntry: tiltSeries.related_empiar_entry,
        }
      : {}),
  }
}

function getTomogramAccordionTestMetadata(
  response: GetRunByIdQuery,
  multipleTomogramsEnabled: boolean,
): DrawerTestMetadata {
  const tomogram = response.runs[0].tomogram_voxel_spacings[0].tomograms[0]

  return multipleTomogramsEnabled
    ? {
        totalTomograms:
          response.tomograms_aggregate.aggregate!.count.toString(),
        resolutionsAvailable: response.tomograms_for_resolutions.map((tomo) =>
          tomo.voxel_spacing.toString(),
        ),
        tomogramProcessing:
          response.tomograms_for_distinct_processing_methods.map((tomo) =>
            startCase(tomo.processing),
          ),
        annotatedObjects: response.annotations_for_object_names
          .map((annotation) => annotation.object_name)
          .slice(0, 4),
      }
    : {
        reconstructionSoftware: tomogram.reconstruction_software,
        reconstructionMethod: tomogram.reconstruction_method,
        processingSoftware: tomogram.processing_software,
        availableProcessing: tomogram.processing,
        smallestAvailableVoxelSpacing: tomogram.voxel_spacing,
        size: `${tomogram.size_x}, ${tomogram.size_y}, ${tomogram.size_z}`,
        fiducialAlignmentStatus: getBoolString(
          isFiducial(tomogram.fiducial_alignment_status),
        ),
        ctfCorrected: tomogram.ctf_corrected ? 'Yes' : 'No',
      }
}

function getAnnotationTestMetdata(
  annotation: DeepPartial<Annotations>,
): DrawerTestMetadata {
  const file = (annotation.files ?? []).at(0)

  const getGroundTruthField = <T>(value: T) =>
    annotation.ground_truth_status ? translations.notApplicable : value

  return {
    annotationAuthors: annotation.authors?.map((author) => author.name),
    publication: annotation.annotation_publication,
    depositionDate: annotation.deposition_date,
    lastModifiedDate: annotation.last_modified_date,
    releaseDate: annotation.release_date,
    methodType: annotation.method_type,
    annotationMethod: annotation.annotation_method,
    annotationSoftware: annotation.annotation_software,
    objectName: annotation.object_name,
    objectId: annotation.object_id,
    objectCount: annotation.object_count,
    objectShapeType: file?.shape_type
      ? getObjectShapeTypeLabel(file.shape_type as ObjectShapeType)
      : '',
    objectState: annotation.object_state,
    objectDescription: annotation.object_description,

    // Ground truth annotations show N/A for precision and recall because they
    // represent the correct or true labels for a dataset. Non ground truth
    // annotations have these fields because they are compared against a ground
    // truth annotation.
    precision: getGroundTruthField(annotation.confidence_precision ?? '--'),
    recall: getGroundTruthField(annotation.confidence_recall ?? '--'),
    groundTruthStatus: getBoolString(annotation.ground_truth_status),
  }
}

function getTomogramDrawerTestMetadata(
  tomogram: DeepPartial<Tomogram>,
  dataset: DeepPartial<Dataset> | null | undefined,
): DrawerTestMetadata {
  console.log('breh', tomogram.isAuthorSubmitted)

  return {
    authors: tomogram.authors!.edges!.map((edge) => edge.node!.name),
    publications:
      dataset?.datasetPublications?.replaceAll('doi:', 'DOI:').split(', ') ??
      '--',
    relatedDatabases: tomogram.relatedDatabaseEntries ?? '--',
    depositionName: tomogram.deposition?.title ?? '--',
    depositionId: tomogram.deposition?.id ?? '--',
    depositionDate: tomogram.deposition?.depositionDate ?? '--',
    releaseDate: tomogram.releaseDate ?? '--',
    lastModifiedDate: tomogram.lastModifiedDate ?? '--',
    portalStandardStatus: tomogram.isPortalStandard ? 'True' : 'False',
    submittedByDatasetAuthor: tomogram.isAuthorSubmitted ? 'True' : 'False',
    reconstructionSoftware: tomogram.reconstructionSoftware,
    reconstructionMethod: tomogram.reconstructionMethod,
    processingSoftware: tomogram.processingSoftware ?? '',
    processing: tomogram.processing,
    voxelSpacing: [
      tomogram.voxelSpacing!.toString(),
      `(${tomogram.sizeX}, ${tomogram.sizeY}, ${tomogram.sizeZ})px`,
    ],
    fiducialAlignmentStatus: getBoolString(
      tomogram.fiducialAlignmentStatus ===
        Fiducial_Alignment_Status_Enum.Fiducial,
    ),
    ctfCorrected: tomogram.ctfCorrected ? 'Yes' : 'No',
    alignmentId: tomogram.alignment!.id,
    canonicalStatus: tomogram.isPortalStandard ? 'True' : 'False',
    alignmentType: tomogram.alignment!.alignmentType,
    dimensionXYZ: `${tomogram.alignment!.volumeXDimension}, ${
      tomogram.alignment!.volumeYDimension
    }, ${tomogram.alignment!.volumeZDimension}`,
    offsetXYZ: `${tomogram.alignment?.volumeXOffset}, ${tomogram.alignment?.volumeYOffset}, ${tomogram.alignment?.volumeZOffset}`,
    rotationX: tomogram.alignment!.xRotationOffset,
    tiltOffset: tomogram.alignment!.tiltOffset,
    affineTransformationMatrix:
      tomogram.alignment!.affineTransformationMatrix!.replaceAll(
        /\{|\}|\[|\]|,|\s/g,
        '',
      ),
  }
}

export async function getSingleDatasetTestMetadata(
  client: ApolloClient<NormalizedCacheObject>,
): Promise<DrawerTestData> {
  const { data } = await getDatasetById({
    client,
    id: +E2E_CONFIG.datasetId,
  })

  const [dataset] = data.datasets
  const [tiltSeries] = dataset.run_metadata[0].tiltseries

  return {
    title: dataset.title,
    metadata: {
      ...getDatasetTestMetadata({
        dataset,
        type: 'dataset',
      }),

      ...getTiltSeriesTestMetadata({
        tiltSeries,
        type: 'dataset',
      }),
    },
  }
}

// #region Data Getters
export async function getSingleRunTestMetadata(
  client: ApolloClient<NormalizedCacheObject>,
  multipleTomogramsEnabled: boolean,
): Promise<DrawerTestData> {
  const { data } = await getRunById({
    client,
    id: +E2E_CONFIG.runId,
    annotationsPage: 1,
  })

  const [run] = data.runs
  const [tiltSeries] = run.tiltseries

  return {
    title: run.name,
    metadata: {
      ...getDatasetTestMetadata({
        dataset: run.dataset,
        type: 'run',
      }),

      ...getTiltSeriesTestMetadata({
        tiltSeries,
        type: 'run',
      }),

      ...getTomogramAccordionTestMetadata(data, multipleTomogramsEnabled),
    },
  }
}

export async function getAnnotationTestData(
  client: ApolloClient<NormalizedCacheObject>,
) {
  const { data } = await getRunById({
    client,
    id: +E2E_CONFIG.runId,
    annotationsPage: 1,
  })

  const { annotation } = data.annotation_files[0]

  return {
    title: `${annotation.id} - ${annotation.object_name}`,
    metadata: getAnnotationTestMetdata(annotation),
  }
}

export async function getTomogramTestData(
  client: ApolloClient<NormalizedCacheObject>,
) {
  const { data } = await getRunByIdV2(client, +E2E_CONFIG.runId, 1)

  const tomogram = data.tomograms[0]
  const { dataset } = data.runs[0]

  return {
    title: startCase(
      `${tomogram.id} ${tomogram.reconstructionMethod} ${tomogram.processing}`,
    ),
    metadata: getTomogramDrawerTestMetadata(tomogram, dataset),
  }
}
// #endregion Data Getters
