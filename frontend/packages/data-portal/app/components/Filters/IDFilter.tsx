import { useSearchParams } from '@remix-run/react'
import { useMemo, useState } from 'react'

import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

import { DropdownFilterButton } from './DropdownFilterButton'
import { InputFilter } from './InputFilter'

export function IDFilter({
  id,
  label,
  title,
  queryParam,
  prefix,
}: {
  id: string
  label: string
  title: string
  queryParam: QueryParams
  prefix?: string
}) {
  const { t } = useI18n()
  const [searchParams, setSearchParams] = useSearchParams()

  const paramValue = searchParams.get(queryParam) ?? ''
  const [value, setValue] = useState(paramValue)

  const validatingRegex = useMemo(
    () => (prefix ? RegExp(`^(?:${prefix})?(\\d+)$`, 'i') : /^\d+$/),
    [prefix],
  )

  const isDisabled = useMemo(
    () => !validatingRegex.test(value),
    [value, validatingRegex],
  )

  return (
    <DropdownFilterButton
      activeFilters={paramValue ? [{ value: `${prefix}${paramValue}` }] : []}
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
        const matches = validatingRegex.exec(value) ?? []

        if (matches.length > 0) {
          const match = matches[1]
          setValue(`${prefix}${match}`)

          setSearchParams((prev) => {
            prev.delete(queryParam)

            if (match) {
              prev.set(queryParam, match)
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
