import { InputText } from '@czi-sds/components'
import { useState } from 'react'
import { match, P } from 'ts-pattern'

import { QueryParams } from 'app/constants/query'
import { DEFAULT_TILT_MAX, DEFAULT_TILT_MIN } from 'app/constants/tiltSeries'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'

import {
  ActiveDropdownFilterData,
  DropdownFilterButton,
} from './DropdownFilterButton'

function TiltRangeInput({
  id,
  onChange,
  placeholder,
  value,
}: {
  id: string
  onChange(value: string): void
  placeholder: number
  value: string
}) {
  const { t } = useI18n()

  return (
    <InputText
      id={id}
      className="!min-w-[85px] !mb-0"
      label={id}
      hideLabel
      placeholder={t('unitDegree', { value: placeholder })}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type="number"
      fullWidth
    />
  )
}

export function TiltRangeFilter() {
  const { t } = useI18n()

  const {
    updateValues,
    tiltSeries: { min: tiltMinParam, max: tiltMaxParam },
  } = useFilter()

  const [tiltMin, setTiltMin] = useState(tiltMinParam)
  const [tiltMax, setTiltMax] = useState(tiltMaxParam)

  const isDisabled =
    tiltMin !== '' &&
    tiltMax !== '' &&
    !Number.isNaN(+tiltMin) &&
    !Number.isNaN(+tiltMax) &&
    +tiltMin > +tiltMax

  return (
    <DropdownFilterButton
      activeFilters={match([tiltMinParam, tiltMaxParam])
        .returnType<ActiveDropdownFilterData[]>()
        .with([P.not(''), ''], () => [
          {
            value: t('valueToValue', {
              value1: t('unitDegree', { value: tiltMin }),
              value2: t('unitDegree', { value: DEFAULT_TILT_MAX }),
            }),
          },
        ])
        .with(['', P.not('')], () => [
          {
            value: t('valueToValue', {
              value1: t('unitDegree', { value: DEFAULT_TILT_MIN }),
              value2: t('unitDegree', { value: tiltMax }),
            }),
          },
        ])
        .with([P.not(''), P.not('')], () => [
          {
            value: t('valueToValue', {
              value1: t('unitDegree', { value: tiltMin }),
              value2: t('unitDegree', { value: tiltMax }),
            }),
          },
        ])
        .otherwise(() => [])}
      description={
        <>
          <p className="text-sds-header-xs leading-sds-header-xs font-semibold">
            {t('tiltRangeFilterTitle')}
          </p>

          <p className="text-sds-gray-600 text-sds-body-xxs leading-sds-body-xxs">
            {t('tiltRangeFilterDescription')}
          </p>
        </>
      }
      disabled={isDisabled}
      label={t('tiltRange')}
      onApply={() => {
        updateValues({
          [QueryParams.TiltRangeMin]: tiltMin,
          [QueryParams.TiltRangeMax]: tiltMax,
        })
      }}
      onCancel={() => {
        setTiltMin(tiltMinParam)
        setTiltMin(tiltMaxParam)
      }}
      onRemoveFilter={() => {
        updateValues({
          [QueryParams.TiltRangeMin]: null,
          [QueryParams.TiltRangeMax]: null,
        })
      }}
      onOpen={() => {
        setTiltMin('')
        setTiltMax('')
      }}
    >
      <div className="flex items-center gap-sds-s max-w-[320px] mt-sds-xs">
        <TiltRangeInput
          id="tilt-min-input"
          placeholder={DEFAULT_TILT_MIN}
          value={tiltMin}
          onChange={setTiltMin}
        />

        <div className="flex items-center gap-sds-xs whitespace-nowrap">
          <span>≤</span>
          <span>{t('filterRange')}</span>
          <span>≤</span>
        </div>

        <TiltRangeInput
          id="tilt-max-input"
          placeholder={DEFAULT_TILT_MAX}
          value={tiltMax}
          onChange={setTiltMax}
        />
      </div>
    </DropdownFilterButton>
  )
}
