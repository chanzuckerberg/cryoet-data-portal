import { useSearchParams } from '@remix-run/react'
import { useMemo, useState } from 'react'

import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

import { DropdownFilterButton } from './DropdownFilterButton'
import { InputFilter } from './InputFilter'

// TODO: make this more generic as a single input popup filter
export function RegexFilter({
  id,
  label,
  title,
  queryParam,
  regex: validationRegex,
  displayNormalizer,
  paramNormalizer,
}: {
  id: string
  label: string
  title: string
  queryParam: QueryParams
  regex: RegExp
  displayNormalizer?: (value: string) => string
  paramNormalizer?: (value: string) => string
}) {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  const paramValue = searchParams.get(queryParam) ?? ''
  const [value, setValue] = useState(paramValue)

  const displayValue = useMemo(
    () => (displayNormalizer ? displayNormalizer(paramValue) : paramValue),
    [paramValue, displayNormalizer],
  )

  const isDisabled = useMemo(
    () => !validationRegex.test(value),
    [value, validationRegex],
  )

  return (
    <DropdownFilterButton
      activeFilters={paramValue ? [{ value: displayValue }] : []}
      description={
        <>
          <p className="text-sds-header-xs leading-sds-header-xs font-semibold">
            {title}
          </p>

          <p className="text-sds-gray-600 text-sds-body-xxs leading-sds-body-xxs">
            {`(${t('limitOneValuePerField')})`}
          </p>
        </>
      }
      label={label}
      onApply={() => {
        const matches = validationRegex.exec(value) ?? []

        if (matches.length > 0) {
          const newParamValue = paramNormalizer ? paramNormalizer(value) : value
          setValue(displayNormalizer ? displayNormalizer(value) : value)

          setSearchParams((prev) => {
            prev.delete(queryParam)

            if (newParamValue) {
              prev.set(queryParam, newParamValue)
            }

            return prev
          })
        }
      }}
      onCancel={() => setValue('')}
      onRemoveFilter={() => {
        setValue('')

        setSearchParams((prev) => {
          prev.delete(queryParam)
          return prev
        })
      }}
      disabled={isDisabled}
    >
      <div className="mt-sds-xs">
        <InputFilter
          value={value}
          id={id}
          label={label}
          onChange={(newValue) => setValue(newValue)}
          hideLabel
          error={!!value && isDisabled}
        />
      </div>
    </DropdownFilterButton>
  )
}
