import { isNumber } from 'lodash-es'
import { useMemo } from 'react'

import { Tiltseries } from 'app/__generated__/graphql'
import { DatabaseEntry } from 'app/components/DatabaseEntry'
import { useI18n } from 'app/hooks/useI18n'
import { TableData } from 'app/types/table'

import { TiltSeriesKeys } from './constants'

export function useTiltSeriesValueMappings(tiltSeries?: Partial<Tiltseries>) {
  const { t } = useI18n()

  return useMemo<Record<TiltSeriesKeys, TableData>>(
    () => ({
      [TiltSeriesKeys.AccelerationVoltage]: {
        label: t('accelerationVoltage'),
        values: [
          tiltSeries?.acceleration_voltage
            ? t('unitVolts', {
                value: tiltSeries?.acceleration_voltage,
              })
            : '--',
        ],
      },

      [TiltSeriesKeys.AdditionalMicroscopeOpticalSetup]: {
        label: t('additionalMicroscopeOpticalSetup'),
        values: [tiltSeries?.microscope_additional_info ?? 'None'],
      },

      [TiltSeriesKeys.AlignedBinning]: {
        label: t('alignedTiltSeriesBinning'),
        values: [tiltSeries?.aligned_tiltseries_binning ?? '--'],
      },

      [TiltSeriesKeys.BinningFromFrames]: {
        label: t('bingingFromFrames'),
        values: [
          tiltSeries?.binning_from_frames
            ? tiltSeries.binning_from_frames
            : '--',
        ],
      },

      [TiltSeriesKeys.CameraManufacturer]: {
        label: t('cameraManufacturer'),
        values: [tiltSeries?.camera_manufacturer ?? '--'],
      },

      [TiltSeriesKeys.CameraModel]: {
        label: t('cameraModel'),
        values: [tiltSeries?.camera_model ?? '--'],
      },

      [TiltSeriesKeys.DataAcquisitionSoftware]: {
        label: t('dataAcquisitionSoftware'),
        values: [tiltSeries?.data_acquisition_software ?? '--'],
      },

      [TiltSeriesKeys.EnergyFilter]: {
        label: t('energyFilter'),
        values: [tiltSeries?.microscope_energy_filter ?? '--'],
      },

      [TiltSeriesKeys.ImageCorrector]: {
        label: t('imageCorrector'),
        values: [tiltSeries?.microscope_image_corrector ?? 'None'],
      },

      [TiltSeriesKeys.MicroscopeManufacturer]: {
        label: t('microscopeManufacturer'),
        values: [tiltSeries?.microscope_manufacturer ?? '--'],
      },

      [TiltSeriesKeys.MicroscopeModel]: {
        label: t('microscopeModel'),
        values: [tiltSeries?.microscope_model ?? '--'],
      },

      [TiltSeriesKeys.PhasePlate]: {
        label: t('phasePlate'),
        values: [tiltSeries?.microscope_phase_plate ?? 'None'],
      },

      [TiltSeriesKeys.PixelSpacing]: {
        label: t('pixelSpacing'),
        values: [tiltSeries?.pixel_spacing ?? '--'],
      },

      [TiltSeriesKeys.RelatedEmpiarEntry]: {
        label: t('relatedEmpiarEntry'),

        values: tiltSeries?.related_empiar_entry
          ? [tiltSeries.related_empiar_entry]
          : [],

        renderValue: (value: string) => <DatabaseEntry entry={value} inline />,
      },

      [TiltSeriesKeys.SeriesIsAligned]: {
        label: t('seriesIsAligned'),
        values: [tiltSeries?.is_aligned ? t('true') : t('false')],
      },

      [TiltSeriesKeys.SphericalAberrationConstant]: {
        label: t('sphericalAberrationConstant'),
        values: [
          tiltSeries?.spherical_aberration_constant
            ? t('unitMillimeter', {
                value: tiltSeries.spherical_aberration_constant,
              })
            : '--',
        ],
      },

      [TiltSeriesKeys.TiltAxis]: {
        label: t('tiltAxis'),
        values: [
          tiltSeries?.tilt_axis
            ? t('unitDegree', { value: tiltSeries.tilt_axis })
            : '--',
        ],
      },

      [TiltSeriesKeys.TiltingScheme]: {
        label: t('tiltingScheme'),
        values: [tiltSeries?.tilting_scheme ?? '--'],
      },

      [TiltSeriesKeys.TiltRange]: {
        label: t('tiltRange'),
        values: [
          tiltSeries &&
          isNumber(tiltSeries?.tilt_min) &&
          isNumber(tiltSeries.tilt_max)
            ? t('valueToValue', {
                value1: t('unitDegree', { value: tiltSeries.tilt_min }),
                value2: t('unitDegree', { value: tiltSeries.tilt_max }),
              })
            : '--',
        ],
      },

      [TiltSeriesKeys.TiltStep]: {
        label: t('tiltStep'),
        values: [
          tiltSeries?.tilt_step
            ? t('unitDegree', { value: tiltSeries.tilt_step })
            : '--',
        ],
      },

      [TiltSeriesKeys.TotalFlux]: {
        label: t('totalFlux'),
        values: [
          tiltSeries?.total_flux
            ? t('unitAngstrom', { value: tiltSeries.total_flux })
            : '--',
        ],
      },
    }),
    [tiltSeries, t],
  )
}
