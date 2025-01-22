import { useMemo } from 'react'

import { Tiltseries } from 'app/__generated__/graphql'
import { DatabaseEntry } from 'app/components/DatabaseEntry'
import { Katex } from 'app/components/Katex'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { Tiltseries as TiltseriesV2 } from 'app/types/gql/genericTypes'
import { TableData } from 'app/types/table'
import { getTiltRangeLabel } from 'app/utils/tiltSeries'

import { TiltSeriesKeys } from './constants'

export function useTiltSeriesValueMappings(
  tiltSeries?: Partial<Tiltseries> | TiltseriesV2,
) {
  const { t } = useI18n()

  const isV2 = isV2Tiltseries(tiltSeries)

  const accelerationVoltage = isV2
    ? tiltSeries.accelerationVoltage
    : tiltSeries?.acceleration_voltage
  const isAligned = isV2 ? tiltSeries.isAligned : tiltSeries?.is_aligned
  const sphericalAberrationConstant = isV2
    ? tiltSeries.sphericalAberrationConstant
    : tiltSeries?.spherical_aberration_constant
  const tiltAxis = isV2 ? tiltSeries.tiltAxis : tiltSeries?.tilt_axis
  const tiltMin = isV2 ? tiltSeries.tiltMin : tiltSeries?.tilt_min
  const tiltMax = isV2 ? tiltSeries.tiltMax : tiltSeries?.tilt_max
  const tiltStep = isV2 ? tiltSeries.tiltStep : tiltSeries?.tilt_step

  return useMemo<Record<TiltSeriesKeys, TableData>>(
    () => ({
      [TiltSeriesKeys.AccelerationVoltage]: {
        label: t('accelerationVoltage'),
        values: [
          accelerationVoltage !== undefined
            ? t('unitVolts', {
                value: accelerationVoltage,
              })
            : '--',
        ],
      },

      [TiltSeriesKeys.AdditionalMicroscopeOpticalSetup]: {
        label: t('additionalMicroscopeOpticalSetup'),
        values: [
          (isV2
            ? tiltSeries.microscopeAdditionalInfo
            : tiltSeries?.microscope_additional_info) ?? 'None',
        ],
      },

      [TiltSeriesKeys.AlignedBinning]: {
        label: t('alignedTiltSeriesBinning'),
        values: [
          (isV2
            ? tiltSeries.alignedTiltseriesBinning
            : tiltSeries?.aligned_tiltseries_binning) ?? '--',
        ],
      },

      [TiltSeriesKeys.BinningFromFrames]: {
        label: t('bingingFromFrames'),
        values: [
          (isV2
            ? tiltSeries.binningFromFrames
            : tiltSeries?.binning_from_frames) ?? '--',
        ],
      },

      [TiltSeriesKeys.CameraManufacturer]: {
        label: t('cameraManufacturer'),
        values: [
          (isV2
            ? tiltSeries.cameraManufacturer
            : tiltSeries?.camera_manufacturer) ?? '--',
        ],
      },

      [TiltSeriesKeys.CameraModel]: {
        label: t('cameraModel'),
        values: [
          (isV2 ? tiltSeries.cameraModel : tiltSeries?.camera_model) ?? '--',
        ],
      },

      [TiltSeriesKeys.DataAcquisitionSoftware]: {
        label: t('dataAcquisitionSoftware'),
        values: [
          (isV2
            ? tiltSeries.dataAcquisitionSoftware
            : tiltSeries?.data_acquisition_software) ?? '--',
        ],
      },

      [TiltSeriesKeys.EnergyFilter]: {
        label: t('energyFilter'),
        values: [
          (isV2
            ? tiltSeries.microscopeEnergyFilter
            : tiltSeries?.microscope_energy_filter) ?? '--',
        ],
      },

      [TiltSeriesKeys.Id]: {
        label: t('tiltSeriesId'),
        values: [
          tiltSeries?.id ? `${IdPrefix.TiltSeries}-${tiltSeries.id}` : '--',
        ],
      },

      [TiltSeriesKeys.ImageCorrector]: {
        label: t('imageCorrector'),
        values: [
          (isV2
            ? tiltSeries.microscopeImageCorrector
            : tiltSeries?.microscope_image_corrector) ?? 'None',
        ],
      },

      [TiltSeriesKeys.MicroscopeManufacturer]: {
        label: t('microscopeManufacturer'),
        values: [
          (isV2
            ? tiltSeries.microscopeManufacturer
            : tiltSeries?.microscope_manufacturer) ?? '--',
        ],
      },

      [TiltSeriesKeys.MicroscopeModel]: {
        label: t('microscopeModel'),
        values: [
          (isV2 ? tiltSeries.microscopeModel : tiltSeries?.microscope_model) ??
            '--',
        ],
      },

      [TiltSeriesKeys.PhasePlate]: {
        label: t('phasePlate'),
        values: [
          (isV2
            ? tiltSeries.microscopePhasePlate
            : tiltSeries?.microscope_phase_plate) ?? 'None',
        ],
      },

      [TiltSeriesKeys.PixelSpacing]: {
        label: t('pixelSpacing'),
        values: [
          (isV2 ? tiltSeries.pixelSpacing : tiltSeries?.pixel_spacing) ?? '--',
        ],
        renderValue: (value) => (
          <p className="flex gap-1 items-center">
            <span>{value}</span>
            <Katex math="\frac{\text{\AA}}{px}" />
          </p>
        ),
      },

      [TiltSeriesKeys.RelatedEmpiarEntry]: {
        label: t('relatedEmpiarEntry'),
        values: [
          (isV2
            ? tiltSeries.relatedEmpiarEntry
            : tiltSeries?.related_empiar_entry) ?? '--',
        ],
        renderValue: (value: string) => <DatabaseEntry entry={value} inline />,
      },

      [TiltSeriesKeys.SeriesIsAligned]: {
        label: t('seriesIsAligned'),
        values: [isAligned ? t('true') : t('false')],
      },

      [TiltSeriesKeys.SphericalAberrationConstant]: {
        label: t('sphericalAberrationConstant'),
        values: [
          sphericalAberrationConstant !== undefined
            ? t('unitMillimeter', {
                value: sphericalAberrationConstant,
              })
            : '--',
        ],
      },

      [TiltSeriesKeys.TiltAxis]: {
        label: t('tiltAxis'),
        values: [tiltAxis ? t('unitDegree', { value: tiltAxis }) : '--'],
      },

      [TiltSeriesKeys.TiltingScheme]: {
        label: t('tiltingScheme'),
        values: [
          (isV2 ? tiltSeries.tiltingScheme : tiltSeries?.tilting_scheme) ??
            '--',
        ],
      },

      [TiltSeriesKeys.TiltRange]: {
        label: t('tiltRange'),
        values: [
          tiltMin !== undefined && tiltMax !== undefined
            ? getTiltRangeLabel(t, tiltMin, tiltMax)
            : '--',
        ],
      },

      [TiltSeriesKeys.TiltStep]: {
        label: t('tiltStep'),
        values: [
          tiltStep !== undefined ? t('unitDegree', { value: tiltStep }) : '--',
        ],
      },

      [TiltSeriesKeys.TotalFlux]: {
        label: t('totalFlux'),
        values: [
          (isV2 ? tiltSeries.totalFlux : tiltSeries?.total_flux) ?? '--',
        ],
        renderValue: (value) => (
          <p className="flex gap-1 items-center">
            <span>{value}</span>
            <Katex math="\frac{e^-}{\text{\AA}^2}" />
          </p>
        ),
      },
    }),
    [
      tiltSeries,
      t,
      accelerationVoltage,
      isAligned,
      isV2,
      sphericalAberrationConstant,
      tiltAxis,
      tiltMax,
      tiltMin,
      tiltStep,
    ],
  )
}

function isV2Tiltseries(
  tiltseries?: Partial<Tiltseries> | TiltseriesV2,
): tiltseries is TiltseriesV2 {
  return tiltseries?.__typename === 'Tiltseries'
}
