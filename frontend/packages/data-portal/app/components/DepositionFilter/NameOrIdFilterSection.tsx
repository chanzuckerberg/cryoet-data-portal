import { useMemo } from 'react'

import {
  FilterSection,
  InputFilterData,
  MultiInputFilter,
} from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

import { DepositionIdFilter } from './DepositionIdFilter'

export function NameOrIdFilterSection() {
  const { t } = useI18n()

  const runIdFilters = useMemo<InputFilterData[]>(
    () => [
      {
        id: 'run-id-input',
        label: `${t('runId')}`,
        queryParam: QueryParams.RunId,
        placeholder: t('runIdPlaceholder'),
      },
      {
        id: 'run-name-input',
        label: `${t('runName')}`,
        queryParam: QueryParams.RunName,
        placeholder: t('runNamePlaceholder'),
      },
    ],
    [t],
  )

  return (
    <FilterSection title={t('nameOrId')}>
      <MultiInputFilter label={t('run')} filters={runIdFilters} />
      <DepositionIdFilter />
    </FilterSection>
  )
}
