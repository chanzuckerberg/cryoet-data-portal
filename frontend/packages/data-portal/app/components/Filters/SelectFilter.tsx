import {
  ComplexFilter,
  DefaultAutocompleteOption,
  Value,
} from '@czi-sds/components'
import { isArray } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import { BaseFilterOption } from 'app/types/filter'

import styles from './SelectFilter.module.css'

/**
 * Wrapper over ComplexFilter to add a type parameter for the autocomplete
 * option so that we can add strict typing to the option keys.
 */
export function SelectFilter<
  Option extends BaseFilterOption,
  Multiple extends boolean = false,
>({
  label,
  multiple,
  onChange,
  options,
  search,
  value,
}: {
  label: string
  multiple?: Multiple
  onChange(value: Value<Option, Multiple>): void
  options: Option[]
  search?: boolean
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

  return (
    <ComplexFilter
      className={styles.filter}
      value={sdsValue}
      label={label}
      search={search}
      multiple={multiple}
      options={sdsOptions}
      onChange={(nextOptions) => {
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
