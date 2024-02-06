import { InputText } from '@czi-sds/components'
import { useState } from 'react'
import { match, P } from 'ts-pattern'

import { QueryParams } from 'app/constants/query'
import { DEFAULT_TILT_MAX, DEFAULT_TILT_MIN } from 'app/constants/tiltSeries'
import { useFilter } from 'app/hooks/useFilter'
import { i18n } from 'app/i18n'

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
  return (
    <InputText
      id={id}
      className="!min-w-[85px] !mb-0"
      label={id}
      hideLabel
      placeholder={i18n.unitDegree(placeholder)}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type="number"
      fullWidth
    />
  )
}

export function TiltRangeFilter() {
  const {
    updateValue,
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
            value: i18n.valueToValue(
              i18n.unitDegree(+tiltMin),
              i18n.unitDegree(DEFAULT_TILT_MAX),
            ),
          },
        ])
        .with(['', P.not('')], () => [
          {
            value: i18n.valueToValue(
              i18n.unitDegree(DEFAULT_TILT_MIN),
              i18n.unitDegree(+tiltMax),
            ),
          },
        ])
        .with([P.not(''), P.not('')], () => [
          {
            value: i18n.valueToValue(
              i18n.unitDegree(+tiltMin),
              i18n.unitDegree(+tiltMax),
            ),
          },
        ])
        .otherwise(() => [])}
      description={
        <>
          <p className="text-sds-header-xs leading-sds-header-xs font-semibold">
            {i18n.tiltRangeFilterTitle}
          </p>

          <p className="text-sds-gray-600 text-sds-body-xxs leading-sds-body-xxs">
            {i18n.tiltRangeFilterDescription}
          </p>
        </>
      }
      disabled={isDisabled}
      label={i18n.tiltRange}
      onApply={() => {
        updateValue(QueryParams.TiltRangeMin, tiltMin)
        updateValue(QueryParams.TiltRangeMax, tiltMax)
      }}
      onCancel={() => {
        setTiltMin(tiltMinParam)
        setTiltMin(tiltMaxParam)
      }}
      onRemoveFilter={() => {
        setTiltMin('')
        setTiltMax('')
        updateValue(QueryParams.TiltRangeMin, null)
        updateValue(QueryParams.TiltRangeMax, null)
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
          <span>{i18n.filterRange}</span>
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
