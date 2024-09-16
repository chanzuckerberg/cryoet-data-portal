import { diff } from 'deep-object-diff'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import {
  GetRunByIdV2Query,
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
