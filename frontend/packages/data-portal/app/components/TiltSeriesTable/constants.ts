import { Tiltseries } from 'app/__generated__/graphql'
import { TableData } from 'app/components/Table'
import { i18n } from 'app/i18n'

export const enum TiltSeriesKeys {
  AccelerationVoltage,
  AdditionalMicroscopeOpticalSetup,
  EnergyFilter,
  CameraManufacturer,
  CameraModel,
  ImageCorrector,
  MicroscopeManufacturer,
  MicroscopeModel,
  PhasePlate,
  SphericalAberrationConstant,
}

export const TILT_SERIES_VALUE_MAPPINGS = new Map([
  [
    TiltSeriesKeys.AccelerationVoltage,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.accelerationVoltage,
        values: [`${data.acceleration_voltage as unknown as number}`],
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
    TiltSeriesKeys.EnergyFilter,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.energyFilter,
        values: [data.microscope_energy_filter!],
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
    TiltSeriesKeys.SphericalAberrationConstant,
    (data: Partial<Tiltseries>): TableData => {
      return {
        label: i18n.sphericalAberrationConstant,
        values: [`${data.spherical_aberration_constant}`],
      }
    },
  ],
])
