import { useMemo } from 'react'

import { DatabaseEntry } from 'app/components/DatabaseEntry'
import { Katex } from 'app/components/Katex'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useI18n } from 'app/hooks/useI18n'
import { Tiltseries as TiltseriesV2 } from 'app/types/gql/genericTypes'
import { TableData } from 'app/types/table'
import { getTiltRangeLabel } from 'app/utils/tiltSeries'

import { TiltSeriesKeys } from './constants'

export function useTiltSeriesValueMappings(tiltSeries?: TiltseriesV2) {
  const { t } = useI18n()

  return useMemo<Record<TiltSeriesKeys, TableData>>(
    () => ({
      [TiltSeriesKeys.AccelerationVoltage]: {
        label: t('accelerationVoltage'),
        values: [
          tiltSeries?.accelerationVoltage !== undefined
            ? t('unitVolts', {
                value: tiltSeries.accelerationVoltage,
              })
            : '--',
        ],
      },

      [TiltSeriesKeys.AdditionalMicroscopeOpticalSetup]: {
        label: t('additionalMicroscopeOpticalSetup'),
        values: [tiltSeries?.microscopeAdditionalInfo ?? 'None'],
      },

      [TiltSeriesKeys.AlignedBinning]: {
        label: t('alignedTiltSeriesBinning'),
        values: [tiltSeries?.alignedTiltseriesBinning ?? '--'],
      },

      [TiltSeriesKeys.BinningFromFrames]: {
        label: t('bingingFromFrames'),
        values: [tiltSeries?.binningFromFrames ?? '--'],
      },

      [TiltSeriesKeys.CameraManufacturer]: {
        label: t('cameraManufacturer'),
        values: [tiltSeries?.cameraManufacturer ?? '--'],
      },

      [TiltSeriesKeys.CameraModel]: {
        label: t('cameraModel'),
        values: [tiltSeries?.cameraModel ?? '--'],
      },

      [TiltSeriesKeys.DataAcquisitionSoftware]: {
        label: t('dataAcquisitionSoftware'),
        values: [tiltSeries?.dataAcquisitionSoftware ?? '--'],
      },

      [TiltSeriesKeys.EnergyFilter]: {
        label: t('energyFilter'),
        values: [tiltSeries?.microscopeEnergyFilter ?? '--'],
      },

      [TiltSeriesKeys.Id]: {
        label: t('tiltSeriesId'),
        values: [
          tiltSeries?.id ? `${IdPrefix.TiltSeries}-${tiltSeries.id}` : '--',
        ],
      },

      [TiltSeriesKeys.ImageCorrector]: {
        label: t('imageCorrector'),
        values: [tiltSeries?.microscopeImageCorrector ?? 'None'],
      },

      [TiltSeriesKeys.MicroscopeManufacturer]: {
        label: t('microscopeManufacturer'),
        values: [tiltSeries?.microscopeManufacturer ?? '--'],
      },

      [TiltSeriesKeys.MicroscopeModel]: {
        label: t('microscopeModel'),
        values: [tiltSeries?.microscopeModel ?? '--'],
      },

      [TiltSeriesKeys.PhasePlate]: {
        label: t('phasePlate'),
        values: [tiltSeries?.microscopePhasePlate ?? 'None'],
      },

      [TiltSeriesKeys.PixelSpacing]: {
        label: t('pixelSpacing'),
        values: [tiltSeries?.pixelSpacing ?? '--'],
        renderValue: (value) => (
          <p className="flex gap-1 items-center">
            <span>{value}</span>
            <Katex math="\frac{\text{\AA}}{px}" />
          </p>
        ),
      },

      [TiltSeriesKeys.RelatedEmpiarEntry]: {
        label: t('relatedEmpiarEntry'),
        values: [tiltSeries?.relatedEmpiarEntry ?? '--'],
        renderValue: (value: string) => <DatabaseEntry entry={value} inline />,
      },

      [TiltSeriesKeys.SeriesIsAligned]: {
        label: t('seriesIsAligned'),
        values: [tiltSeries?.isAligned === true ? t('true') : t('false')],
      },

      [TiltSeriesKeys.SphericalAberrationConstant]: {
        label: t('sphericalAberrationConstant'),
        values: [
          tiltSeries?.sphericalAberrationConstant !== undefined
            ? t('unitMillimeter', {
                value: tiltSeries.sphericalAberrationConstant,
              })
            : '--',
        ],
      },

      [TiltSeriesKeys.TiltAxis]: {
        label: t('tiltAxis'),
        values: [
          tiltSeries?.tiltAxis
            ? t('unitDegree', { value: tiltSeries.tiltAxis })
            : '--',
        ],
      },

      [TiltSeriesKeys.TiltingScheme]: {
        label: t('tiltingScheme'),
        values: [tiltSeries?.tiltingScheme ?? '--'],
      },

      [TiltSeriesKeys.TiltRange]: {
        label: t('tiltRange'),
        values: [
          tiltSeries?.tiltRange !== undefined &&
          tiltSeries?.tiltMin !== undefined &&
          tiltSeries?.tiltMax !== undefined
            ? getTiltRangeLabel(
                t,
                tiltSeries.tiltRange,
                tiltSeries.tiltMin,
                tiltSeries.tiltMax,
              )
            : '--',
        ],
      },

      [TiltSeriesKeys.TiltStep]: {
        label: t('tiltStep'),
        values: [
          tiltSeries?.tiltStep !== undefined
            ? t('unitDegree', { value: tiltSeries.tiltStep })
            : '--',
        ],
      },

      [TiltSeriesKeys.TotalFlux]: {
        label: t('totalFlux'),
        values: [tiltSeries?.totalFlux ?? '--'],
        renderValue: (value) => (
          <p className="flex gap-1 items-center">
            <span>{value}</span>
            <Katex math="\frac{e^-}{\text{\AA}^2}" />
          </p>
        ),
      },
    }),
    [tiltSeries, t],
  )
}
