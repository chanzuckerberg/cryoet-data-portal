import { ComplexFilter, DefaultAutocompleteOption } from '@czi-sds/components'
// eslint-disable-next-line cryoet-data-portal/no-root-mui-import
import { AutocompleteValue } from '@mui/base'
import { isArray, isEqual } from 'lodash-es'
import { ReactNode, useCallback, useMemo } from 'react'

import { BaseFilterOption } from 'app/types/filter'
import { cns } from 'app/utils/cns'

import styles from './Filters.module.css'

type DisableClearable = false
type FreeSolo = false

/**
 * Wrapper over ComplexFilter to add a type parameter for the autocomplete
 * option so that we can add strict typing to the option keys.
 */
export function SelectFilter<
  Option extends BaseFilterOption,
  Multiple extends boolean = false,
>({
  className,
  details,
  groupBy: groupByProp,
  label,
  multiple,
  onChange,
  options,
  popperClassName,
  search,
  title,
  value,
}: {
  className?: string
  details?: ReactNode
  groupBy?: (
    option: AutocompleteValue<Option, Multiple, DisableClearable, FreeSolo>,
  ) => string
  label: string
  multiple?: Multiple
  onChange(
    value: AutocompleteValue<Option, Multiple, DisableClearable, FreeSolo>,
  ): void
  options: Option[]
  popperClassName?: string
  search?: boolean
  title?: string
  value?: AutocompleteValue<Option, Multiple, DisableClearable, FreeSolo>
}) {
  const labelValueMap = useMemo(
    () =>
      Object.fromEntries(
        options.map((option) => [option.label ?? option.value, option.value]),
      ),
    [options],
  )

  const convertSdsOptionToBaseOption = useCallback(
    (option: string | DefaultAutocompleteOption) =>
      ({
        ...(typeof option === 'string' ? {} : option),
        label: typeof option === 'string' ? option : option.name,
        value: labelValueMap[typeof option === 'string' ? option : option.name],
      }) as AutocompleteValue<Option, Multiple, DisableClearable, FreeSolo>,
    [labelValueMap],
  )

  const convertBaseOptionToSdsOption = useCallback(
    ({ label: optionLabel, value: optionValue, ...option }: Option) =>
      ({
        ...option,
        name: optionLabel ?? optionValue,
      }) as DefaultAutocompleteOption,
    [],
  )

  type SdsOption = AutocompleteValue<
    DefaultAutocompleteOption,
    Multiple,
    DisableClearable,
    FreeSolo
  >

  const sdsOptions = useMemo(
    () => options.map(convertBaseOptionToSdsOption),
    [convertBaseOptionToSdsOption, options],
  )

  const sdsValue = useMemo(() => {
    if (isArray(value)) {
      return value.map(convertBaseOptionToSdsOption) as SdsOption
    }

    if (value) {
      return convertBaseOptionToSdsOption(value as Option) as SdsOption
    }

    return null
  }, [convertBaseOptionToSdsOption, value])

  const groupBy = groupByProp
    ? (option: DefaultAutocompleteOption) =>
        groupByProp(convertSdsOptionToBaseOption(option))
    : undefined

  return (
    <ComplexFilter
      className={cns('flex flex-col justify-center', styles.select, className)}
      value={
        sdsValue as unknown as AutocompleteValue<
          DefaultAutocompleteOption,
          Multiple,
          DisableClearable,
          FreeSolo
        >
      }
      label={label}
      search={search}
      multiple={multiple}
      options={sdsOptions}
      DropdownMenuProps={{
        groupBy,
        title,
        PopperBaseProps: {
          className: cns(
            '!w-full max-w-[240px]',
            popperClassName,
            styles.popper,
          ),
        },
      }}
      InputDropdownProps={
        details
          ? {
              value: details,
              sdsStyle: 'minimal',
              sdsType: 'label',
            }
          : undefined
      }
      onChange={(nextOptions) => {
        if (isEqual(nextOptions, sdsValue)) {
          return
        }

        if (isArray(nextOptions)) {
          onChange(
            nextOptions.map(
              convertSdsOptionToBaseOption,
            ) as unknown as AutocompleteValue<
              Option,
              Multiple,
              DisableClearable,
              FreeSolo
            >,
          )
        } else {
          onChange(
            (nextOptions
              ? convertSdsOptionToBaseOption(nextOptions)
              : null) as AutocompleteValue<
              Option,
              Multiple,
              DisableClearable,
              FreeSolo
            >,
          )
        }
      }}
    />
  )
}
