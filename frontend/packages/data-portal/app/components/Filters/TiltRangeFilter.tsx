import { InputText } from '@czi-sds/components'
import { useState } from 'react'
import { match, P } from 'ts-pattern'

import { QueryParams } from 'app/constants/query'
import {
  DEFAULT_TILT_RANGE_MAX,
  DEFAULT_TILT_RANGE_MIN,
} from 'app/constants/tiltSeries'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'

import {
  ActiveDropdownFilterData,
  DropdownFilterButton,
} from './DropdownFilterButton'

function TiltRangeInput({
  id,
  label,
  onChange,
  placeholder,
  value,
}: {
  id: string
  label: string
  onChange(value: string): void
  placeholder: number
  value: string
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col gap-sds-xxxs">
      <p className="text-sds-body-xs leading-sds-body-xs tracking-sds-default">
        {label}:
      </p>

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
    </div>
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
              value1: t('unitDegree', { value: tiltMinParam }),
              value2: t('unitDegree', { value: DEFAULT_TILT_RANGE_MAX }),
            }),
          },
        ])
        .with(['', P.not('')], () => [
          {
            value: t('valueToValue', {
              value1: t('unitDegree', { value: DEFAULT_TILT_RANGE_MIN }),
              value2: t('unitDegree', { value: tiltMaxParam }),
            }),
          },
        ])
        .with([P.not(''), P.not('')], () => [
          {
            value: t('valueToValue', {
              value1: t('unitDegree', { value: tiltMinParam }),
              value2: t('unitDegree', { value: tiltMaxParam }),
            }),
          },
        ])
        .otherwise(() => [])}
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
        setTiltMax(tiltMaxParam)
      }}
      onRemoveFilter={() => {
        updateValues({
          [QueryParams.TiltRangeMin]: null,
          [QueryParams.TiltRangeMax]: null,
        })
      }}
    >
      <div className="flex flex-col gap-sds-xs max-w-[320px] mt-sds-xs">
        <div className="flex items-center gap-sds-l">
          <TiltRangeInput
            label={t('tiltRangeMin')}
            id="tilt-min-input"
            placeholder={DEFAULT_TILT_RANGE_MIN}
            value={tiltMin}
            onChange={setTiltMin}
          />

          <TiltRangeInput
            label={t('tiltRangeMax')}
            id="tilt-max-input"
            placeholder={DEFAULT_TILT_RANGE_MAX}
            value={tiltMax}
            onChange={setTiltMax}
          />
        </div>

        <p className="text-light-sds-color-primitive-gray-600 text-sds-body-xxs leading-sds-body-xxs">
          {t('tiltRangeFilterDescription')}
        </p>
      </div>
    </DropdownFilterButton>
  )
}
