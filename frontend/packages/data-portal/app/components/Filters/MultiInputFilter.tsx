import { useSearchParams } from '@remix-run/react'
import { isEqual } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'

import { QueryParams } from 'app/constants/query'
import { i18n } from 'app/i18n'

import { DropdownFilterButton } from './DropdownFilterButton'
import { InputFilter } from './InputFilter'

export interface InputFilterData {
  id: string
  label: string
  queryParam: QueryParams
  hideLabel?: boolean
}

export function MultiInputFilter({
  filters,
  label,
  title,
  subtitle,
}: {
  filters: InputFilterData[]
  label: string
  title?: string
  subtitle?: string
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const getQueryParamValues = useCallback(
    () =>
      Object.fromEntries(
        filters.map((filter) => [
          filter.id,
          searchParams.get(filter.queryParam) ?? '',
        ]),
      ),
    [filters, searchParams],
  )

  const [values, setValues] = useState(getQueryParamValues)

  const isDisabled = useMemo(
    () => isEqual(values, getQueryParamValues()),
    [getQueryParamValues, values],
  )

  return (
    <DropdownFilterButton
      activeFilters={filters
        .filter((filter) => searchParams.has(filter.queryParam))
        .map((filter) => ({
          label: filter.label,
          value: values[filter.id],
        }))}
      description={
        <>
          <p className="text-sds-header-xs leading-sds-header-xs font-semibold">
            {title ?? i18n.filterByAnyOfTheFollowing}
          </p>

          <p className="text-sds-gray-600 text-sds-body-xxs leading-sds-body-xxs">
            {subtitle ?? `(${i18n.limitOneValuePerField})`}
          </p>
        </>
      }
      label={label}
      onApply={() =>
        setSearchParams((prev) => {
          filters.forEach((filter) => {
            prev.delete(filter.queryParam)
            const value = values[filter.id]

            if (value) {
              prev.set(filter.queryParam, value)
            }
          })

          return prev
        })
      }
      onCancel={() => setValues(getQueryParamValues())}
      onRemoveFilter={(filterToRemove) => {
        const filter = filters.find(
          ({ id }) => values[id] === filterToRemove.value,
        )

        if (!filter) {
          return
        }

        setValues((prev) => ({
          ...prev,
          [filter.id]: '',
        }))

        setSearchParams((prev) => {
          prev.delete(filter.queryParam)
          return prev
        })
      }}
      disabled={isDisabled}
    >
      <div className="flex flex-col gap-sds-l mt-sds-xs">
        {filters.map((filter) => (
          <InputFilter
            key={filter.id}
            value={values[filter.id]}
            id={filter.id}
            label={filter.label}
            hideLabel={filter.hideLabel}
            onChange={(value) =>
              setValues((prev) => ({
                ...prev,
                [filter.id]: value,
              }))
            }
          />
        ))}
      </div>
    </DropdownFilterButton>
  )
}
