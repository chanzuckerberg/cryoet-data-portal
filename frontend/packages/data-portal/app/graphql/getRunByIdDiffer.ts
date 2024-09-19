import { diff } from 'deep-object-diff'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import {
  GetRunByIdV2Query,
  Sample_Type_Enum,
  Tiltseries_Microscope_Manufacturer_Enum,
} from 'app/__generated_v2__/graphql'

/* eslint-disable no-console */
export function logIfHasDiff(
  url: string,
  v1: GetRunByIdQuery,
  v2: GetRunByIdV2Query,
): void {
  console.log('Checking for run query diffs')

  const v1Transformed: GetRunByIdV2Query = {
    runs: v1.runs.map((run) => ({
      __typename: 'Run',
      id: run.id,
      name: run.name,
      tiltseries: {
        __typename: 'TiltseriesConnection',
        edges: run.tiltseries.map((runTiltseries) => ({
          __typename: 'TiltseriesEdge',
          node: {
            __typename: 'Tiltseries',
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
        __typename: 'Dataset',
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
        // publications: run.dataset.dataset_publications,
        relatedDatabaseEntries: run.dataset.related_database_entries,
        releaseDate: `${run.dataset.release_date}T00:00:00+00:00`,
        s3Prefix: run.dataset.s3_prefix,
        samplePreparation: run.dataset.sample_preparation,
        sampleType: run.dataset.sample_type as Sample_Type_Enum,
        tissueName: run.dataset.tissue_name,
        tissueId: run.dataset.tissue_id,
        title: run.dataset.title,
        fundingSources: {
          __typename: 'DatasetFundingConnection',
          edges: run.dataset.funding_sources.map((source) => ({
            __typename: 'DatasetFundingEdge',
            node: {
              __typename: 'DatasetFunding',
              fundingAgencyName: source.funding_agency_name,
              grantId: source.grant_id,
            },
          })),
        },
        authors: {
          __typename: 'DatasetAuthorConnection',
          edges: run.dataset.authors.map((author) => ({
            __typename: 'DatasetAuthorEdge',
            node: {
              __typename: 'DatasetAuthor',
              correspondingAuthorStatus: author.corresponding_author_status,
              email: author.email,
              name: author.name,
              orcid: author.orcid,
              primaryAuthorStatus: author.primary_author_status,
            },
          })),
        },
      },
    })),
  }

  const diffObject = diff(v1Transformed, v2)

  if (Object.keys(diffObject).length > 0) {
    console.log(
      `DIFF AT ${url}: ${JSON.stringify(diffObject)} | ${JSON.stringify(
        diff(v2, v1Transformed),
      )}`,
    )
  }
}
