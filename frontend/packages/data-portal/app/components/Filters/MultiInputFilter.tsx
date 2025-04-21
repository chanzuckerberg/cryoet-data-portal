import { useSearchParams } from '@remix-run/react'
import { isEqual } from 'lodash-es'
import { useCallback, useMemo, useState } from 'react'

import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'
import { isFilterPrefixValid, removeIdPrefix } from 'app/utils/idPrefixes'

import { DropdownFilterButton } from './DropdownFilterButton'
import { InputFilter } from './InputFilter'

export interface InputFilterData {
  id: string
  label: string
  queryParam: QueryParams
  hideLabel?: boolean
  placeholder?: string
}

export interface MultiInputFilterProps {
  filters: InputFilterData[]
  label: string
  title?: string
  subtitle?: string
}

export function MultiInputFilter({
  filters,
  label,
  title,
  subtitle,
}: MultiInputFilterProps) {
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

  const isDisabled = useMemo(() => {
    const hasInvalidPrefix = !!filters.find(
      (filter) => !isFilterPrefixValid(values[filter.id], filter.queryParam),
    )

    return hasInvalidPrefix || isEqual(values, getQueryParamValues())
  }, [filters, getQueryParamValues, values])

  const { t } = useI18n()

  return (
    <DropdownFilterButton
      activeFilters={filters
        .filter((filter) => searchParams.has(filter.queryParam))
        .map((filter) => ({
          label: filters.length > 1 ? filter.label : '',
          value: values[filter.id],
          queryParam: filter.queryParam,
        }))}
      description={
        <>
          <p className="text-sds-header-xs-600-wide leading-sds-header-xs font-semibold">
            {title ?? t('filterByAnyOfTheFollowing')}
          </p>

          <p className="text-light-sds-color-primitive-gray-600 text-sds-body-xxs-400-wide leading-sds-body-xxs">
            {subtitle ?? `(${t('limitOneValuePerField')})`}
          </p>
        </>
      }
      label={label}
      onApply={() =>
        setSearchParams(
          (prev) => {
            filters.forEach((filter) => {
              prev.delete(filter.queryParam)
              const value = values[filter.id]

              if (value) {
                // Our filters currently support numeric IDs and use the queryParam as the key
                // The filter will show the prefix, but we do not need to store it in the query params
                prev.set(
                  filter.queryParam,
                  removeIdPrefix(value, filter.queryParam) ?? '',
                )
              }
            })

            prev.delete(QueryParams.Page)
            return prev
          },
          { preventScrollReset: true },
        )
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

        setSearchParams(
          (prev) => {
            prev.delete(filter.queryParam)
            return prev
          },
          { preventScrollReset: true },
        )
      }}
      disabled={isDisabled}
    >
      <div className="flex flex-col gap-sds-l mt-sds-xs">
        {filters.map((filter, i) => (
          <InputFilter
            key={filter.id}
            value={values[filter.id]}
            id={filter.id}
            label={filter.label}
            hideLabel={filter.hideLabel}
            placeholder={filter.placeholder || ''}
            onChange={(value) =>
              setValues((prev) => ({
                ...prev,
                [filter.id]: value,
              }))
            }
            className={cns(i < filters.length - 1 && '!mb-0')}
          />
        ))}
      </div>
    </DropdownFilterButton>
  )
}
