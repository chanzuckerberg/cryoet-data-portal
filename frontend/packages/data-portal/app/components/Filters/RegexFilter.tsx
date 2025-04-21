import { useSearchParams } from '@remix-run/react'
import { useMemo, useState } from 'react'

import { PrefixOption } from 'app/components/AnnotationFilter/ObjectIdFilter/PrefixValueContext'
import { QueryParams } from 'app/constants/query'

import { DropdownFilterButton } from './DropdownFilterButton'
import { InputFilter } from './InputFilter'
import { PrefixOptionFilter } from './PrefixOptionFilter'

export interface RegexFilterProps {
  id: string
  label: string
  title: string
  queryParam: QueryParams
  regex: RegExp
  prefixOptions?: PrefixOption[]
  displayNormalizer?(value: string): string
  paramNormalizer?(value: string): string
  placeholder?: string
  instructions?: string
}

// TODO: make this more generic as a single input popup filter
export function RegexFilter({
  id,
  label,
  title,
  queryParam,
  regex: validationRegex,
  displayNormalizer,
  paramNormalizer,
  prefixOptions,
  placeholder,
  instructions,
}: RegexFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const paramValue = searchParams.get(queryParam) ?? ''
  const [value, setValue] = useState(paramValue)

  const displayValue = useMemo(
    () => (displayNormalizer ? displayNormalizer(paramValue) : paramValue),
    [paramValue, displayNormalizer],
  )

  const isDisabled = useMemo(() => {
    return !validationRegex.test(value)
  }, [value, validationRegex])

  return (
    <DropdownFilterButton
      activeFilters={paramValue ? [{ value: displayValue, queryParam }] : []}
      description={
        <>
          <p className="text-sds-header-s-600-wide leading-sds-header-s tracking-sds-body-s-600-wide font-semibold">
            {title}
          </p>

          {instructions && (
            <p className="text-light-sds-color-primitive-gray-600 text-sds-body-xxs-400-wide leading-sds-body-xxs tracking-sds-body-xxs">
              {instructions}
            </p>
          )}
        </>
      }
      label={label}
      onApply={() => {
        const matches = validationRegex.exec(value) ?? []

        if (matches.length > 0) {
          const newParamValue = paramNormalizer ? paramNormalizer(value) : value
          setValue(displayNormalizer ? displayNormalizer(value) : value)

          setSearchParams(
            (prev) => {
              prev.delete(queryParam)

              if (newParamValue) {
                prev.set(queryParam, newParamValue)
              }

              return prev
            },
            { preventScrollReset: true },
          )
        }
      }}
      onCancel={() => setValue('')}
      onRemoveFilter={() => {
        setValue('')

        setSearchParams(
          (prev) => {
            prev.delete(queryParam)
            return prev
          },
          { preventScrollReset: true },
        )
      }}
      disabled={isDisabled}
    >
      <div className="mt-sds-m">
        {prefixOptions ? (
          <PrefixOptionFilter
            value={value}
            id={id}
            label={label}
            onChange={(newValue) => setValue(newValue)}
            prefixOptions={prefixOptions}
            hideLabel
            error={!!value && isDisabled}
          />
        ) : (
          <InputFilter
            value={value}
            id={id}
            label={label}
            onChange={(newValue) => setValue(newValue)}
            hideLabel
            placeholder={placeholder}
            error={!!value && isDisabled}
          />
        )}
      </div>
    </DropdownFilterButton>
  )
}
