/* eslint-disable @typescript-eslint/no-unused-vars */

import { Tiltseries } from 'app/__generated__/graphql'
import { DatabaseEntry } from 'app/components/DatabaseEntry'
import { TableData } from 'app/components/Table'
import { i18n } from 'app/i18n'

export const enum TiltSeriesKeys {
  AccelerationVoltage,
  AdditionalMicroscopeOpticalSetup,
  AlignedBinning,
  BinningFromFrames,
  CameraManufacturer,
  CameraModel,
  DataAcquisitionSoftware,
  EnergyFilter,
  ImageCorrector,
  MicroscopeManufacturer,
  MicroscopeModel,
  PhasePlate,
  PixelSpacing,
  RelatedEmpiarEntry,
  SeriesIsAligned,
  SphericalAberrationConstant,
  TiltAxis,
  TiltingScheme,
  TiltRange,
  TiltStep,
  TotalFlux,
}

export const TILT_SERIES_VALUE_MAPPINGS = new Map([
  [
    TiltSeriesKeys.AccelerationVoltage,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.accelerationVoltage,
        values: [
          i18n.unitVolts(data.acceleration_voltage as unknown as number),
        ],
      }
    },
  ],
  [
    TiltSeriesKeys.AdditionalMicroscopeOpticalSetup,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.additionalMicroscopeOpticalSetup,
        values: [data.microscope_additional_info ?? 'None'],
      }
    },
  ],
  [
    TiltSeriesKeys.AlignedBinning,
    (_data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.alignedTiltSeriesBinning,
        values: ['TBD'],
      }
    },
  ],
  [
    TiltSeriesKeys.BinningFromFrames,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.bingingFromFrames,
        values: [data.binning_from_frames],
      }
    },
  ],
  [
    TiltSeriesKeys.CameraManufacturer,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.cameraManufacturer,
        values: [data.camera_manufacturer!],
      }
    },
  ],
  [
    TiltSeriesKeys.CameraModel,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.cameraModel,
        values: [data.camera_model!],
      }
    },
  ],
  [
    TiltSeriesKeys.DataAcquisitionSoftware,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.dataAcquisitionSoftware,
        values: [data.data_acquisition_software!],
      }
    },
  ],
  [
    TiltSeriesKeys.EnergyFilter,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.energyFilter,
        values: [data.microscope_energy_filter!],
      }
    },
  ],
  [
    TiltSeriesKeys.ImageCorrector,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.imageCorrector,
        values: [data.microscope_image_corrector ?? 'None'],
      }
    },
  ],
  [
    TiltSeriesKeys.MicroscopeManufacturer,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.microscopeManufacturer,
        values: [data.microscope_manufacturer!],
      }
    },
  ],
  [
    TiltSeriesKeys.MicroscopeModel,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.microscopeModel,
        values: [data.microscope_model!],
      }
    },
  ],
  [
    TiltSeriesKeys.PhasePlate,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.phasePlate,
        values: [data.microscope_phase_plate ?? 'None'],
      }
    },
  ],
  [
    TiltSeriesKeys.PixelSpacing,
    (_data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.pixelSpacing,
        values: ['TBD'],
      }
    },
  ],
  [
    TiltSeriesKeys.RelatedEmpiarEntry,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.relatedEmpiarEntry,
        renderValue: data.related_empiar_entry
          ? (value) => <DatabaseEntry entry={value} inline />
          : undefined,
        values: data.related_empiar_entry ? [data.related_empiar_entry] : [],
      }
    },
  ],
  [
    TiltSeriesKeys.SeriesIsAligned,
    (_data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.seriesIsAligned,
        values: ['TBD'],
      }
    },
  ],
  [
    TiltSeriesKeys.SphericalAberrationConstant,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.sphericalAberrationConstant,
        values: [i18n.unitMilimeter(+data.spherical_aberration_constant)],
      }
    },
  ],
  [
    TiltSeriesKeys.TiltAxis,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.tiltAxis,
        values: [i18n.unitDegree(+data.tilt_axis)],
      }
    },
  ],
  [
    TiltSeriesKeys.TiltingScheme,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.tiltingScheme,
        values: [data.tilting_scheme!],
      }
    },
  ],
  [
    TiltSeriesKeys.TiltRange,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.tiltRange,
        values: [
          i18n.valueToValue(
            i18n.unitDegree(+data.tilt_min),
            i18n.unitDegree(+data.tilt_max),
          ),
        ],
      }
    },
  ],
  [
    TiltSeriesKeys.TiltStep,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.tiltStep,
        values: [i18n.unitDegree(+data.tilt_step)],
      }
    },
  ],
  [
    TiltSeriesKeys.TotalFlux,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.totalFlux,
        values: [i18n.unitAngstrom(+data.total_flux)],
      }
    },
  ],
])
