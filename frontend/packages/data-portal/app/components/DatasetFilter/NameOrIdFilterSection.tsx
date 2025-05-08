import { useMemo } from 'react'

import {
  AuthorFilter,
  FilterSection,
  InputFilterData,
  MultiInputFilter,
} from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

export function NameOrIdFilterSection() {
  const { t } = useI18n()

  const datasetIdFilters = useMemo<InputFilterData[]>(
    () => [
      {
        id: 'portal-id-input',
        label: `${t('datasetId')}:`,
        queryParam: QueryParams.DatasetId,
        placeholder: t('datasetIdPlaceholder'),
      },
      {
        id: 'empiar-id-input',
        label: `${t('empiarID')}:`,
        queryParam: QueryParams.EmpiarId,
        placeholder: t('empiarIDPlaceholder'),
      },
      {
        id: 'emdb-id-input',
        label: `${t('emdb')}:`,
        queryParam: QueryParams.EmdbId,
        placeholder: t('emdbPlaceholder'),
      },
    ],
    [t],
  )

  return (
    <FilterSection title={t('nameOrId')}>
      <MultiInputFilter label={t('datasetIds')} filters={datasetIdFilters} />
      <AuthorFilter label={t('author')} />
    </FilterSection>
  )
}
