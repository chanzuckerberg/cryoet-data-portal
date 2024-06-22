import {
  Annotations,
  Datasets,
  Tiltseries,
  Tomograms,
} from 'app/__generated__/graphql'

import { DrawerTestMetadata } from './types'

export function getBoolString(value: boolean): string {
  return value ? 'True' : 'False'
}

export function getDatasetTestMetadata({
  dataset,
  type,
}: {
  dataset: Datasets
  type: 'dataset' | 'run'
}): DrawerTestMetadata {
  return {
    cellLineOrStrainName: dataset.cell_strain_name,
    cellName: dataset.cell_name,
    cellularComponent: dataset.cell_component_name,
    citations: dataset.dataset_citations?.split(', ') ?? [],
    depositionDate: dataset.deposition_date,
    fundingAgency: dataset.funding_sources.map(
      (source) => source.funding_agency_name,
    ),
    grantID: dataset.funding_sources.map((source) => source.grant_id ?? ''),
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
          authors: dataset.authors.map((author) => author.name),
        }
      : {}),
  }
}

export function getTiltSeriesTestMetadata({
  tiltSeries,
  type,
}: {
  tiltSeries: Tiltseries
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

export function getTomogramTestMetadata(
  tomogram: Tomograms,
): DrawerTestMetadata {
  return {
    reconstructionSoftware: tomogram.reconstruction_software,
    reconstructionMethod: tomogram.reconstruction_method,
    processingSoftware: tomogram.processing_software,
    availableProcessing: tomogram.processing,
    smallestAvailableVoxelSpacing: tomogram.voxel_spacing,
    size: `${tomogram.size_x}, ${tomogram.size_y}, ${tomogram.size_z}`,
    fiducialAlignmentStatus: getBoolString(
      tomogram.fiducial_alignment_status === 'FIDUCIAL',
    ),
    ctfCorrected: tomogram.ctf_corrected ? 'Yes' : 'No',
  }
}

export function getAnnotationTestMetdata(
  annotation: Annotations,
): DrawerTestMetadata {
  const [file] = annotation.files

  return {
    annotationId: annotation.id,
    annotationAuthors: annotation.authors.map((author) => author.name),
    publication: annotation.annotation_publication,
    depositionDate: annotation.deposition_date,
    lastModifiedDate: annotation.last_modified_date,
    releaseDate: annotation.release_date,
    methodType: annotation.method_type,
    annotationMethod: annotation.annotation_method,
    annotationSoftware: annotation.annotation_software,
    objectName: annotation.object_name,
    goId: annotation.object_id,
    objectCount: annotation.object_count,
    objectShapeType: file.shape_type,
    objectState: annotation.object_state,
    objectDescription: annotation.object_description,
    groundTruthStatus: getBoolString(annotation.ground_truth_status),
    groundTruthUsed: annotation.ground_truth_used,
    precision: annotation.confidence_precision,
    recall: annotation.confidence_recall,
  }
}
