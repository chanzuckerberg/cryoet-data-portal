import {
  ComplexFilter,
  DefaultAutocompleteOption,
  Value,
} from '@czi-sds/components'
import { isArray, isEqual } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import { BaseFilterOption } from 'app/types/filter'
import { cns } from 'app/utils/cns'

import styles from './Filters.module.css'

/**
 * Wrapper over ComplexFilter to add a type parameter for the autocomplete
 * option so that we can add strict typing to the option keys.
 */
export function SelectFilter<
  Option extends BaseFilterOption,
  Multiple extends boolean = false,
>({
  className,
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
  groupBy?: (option: Value<Option, Multiple>) => string
  label: string
  multiple?: Multiple
  onChange(value: Value<Option, Multiple>): void
  options: Option[]
  popperClassName?: string
  search?: boolean
  title?: string
  value?: Value<Option, Multiple>
}) {
  const labelValueMap = useMemo(
    () =>
      Object.fromEntries(
        options.map((option) => [option.label ?? option.value, option.value]),
      ),
    [options],
  )

  const convertSdsOptionToBaseOption = useCallback(
    ({ name, ...sdsOption }: DefaultAutocompleteOption) =>
      ({
        ...sdsOption,
        label: name,
        value: labelValueMap[name],
      }) as Value<Option, Multiple>,
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

  type SdsOption = Value<DefaultAutocompleteOption, Multiple>

  const sdsOptions = useMemo(
    () => options.map(convertBaseOptionToSdsOption),
    [convertBaseOptionToSdsOption, options],
  )

  const sdsValue = useMemo(() => {
    if (isArray(value)) {
      return value.map(convertBaseOptionToSdsOption) as unknown as SdsOption
    }

    if (value) {
      return convertBaseOptionToSdsOption(
        value as Option,
      ) as unknown as SdsOption
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
      value={sdsValue}
      label={label}
      search={search}
      multiple={multiple}
      options={sdsOptions}
      DropdownMenuProps={{
        groupBy,
        title,
        PopperBaseProps: {
          className: cns(popperClassName, multiple && styles.popper),
        },
      }}
      onChange={(nextOptions) => {
        if (isEqual(nextOptions, sdsValue)) {
          return
        }

        if (isArray(nextOptions)) {
          onChange(
            nextOptions.map(convertSdsOptionToBaseOption) as unknown as Value<
              Option,
              Multiple
            >,
          )
        } else {
          onChange(
            (nextOptions
              ? convertSdsOptionToBaseOption(nextOptions)
              : null) as Value<Option, Multiple>,
          )
        }
      }}
    />
  )
}
