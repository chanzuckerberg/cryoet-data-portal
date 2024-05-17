import { useMemo } from 'react'

import { SelectFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { BaseFilterOption } from 'app/types/filter'

export function MethodTypeFilter() {
  const { t } = useI18n()

  const {
    updateValue,
    annotation: { methodTypes },
  } = useFilter()

  const filterOptions = useMemo<BaseFilterOption[]>(
    () => [
      {
        value: 'automated',
        label: t('automated'),
      },
      {
        value: 'manual',
        label: t('manual'),
      },
      {
        value: 'hybrid',
        label: t('hybrid'),
      },
    ],
    [t],
  )

  const methodTypeValue = useMemo<BaseFilterOption[]>(
    () => filterOptions.filter(({ value }) => methodTypes.includes(value)),
    [filterOptions, methodTypes],
  )

  return (
    <SelectFilter
      multiple
      label={t('methodType')}
      onChange={(options) => updateValue(QueryParams.MethodType, options)}
      options={filterOptions}
      value={methodTypeValue}
    />
  )
}
