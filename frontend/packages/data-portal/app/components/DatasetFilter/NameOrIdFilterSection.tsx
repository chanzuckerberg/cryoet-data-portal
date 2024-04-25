import { useMemo } from 'react'

import {
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
      },
      {
        id: 'empiar-id-input',
        label: `${t('empiarID')}:`,
        queryParam: QueryParams.EmpiarId,
      },
      {
        id: 'emdb-id-input',
        label: `${t('emdb')}:`,
        queryParam: QueryParams.EmdbId,
      },
    ],
    [t],
  )

  const authorFilters = useMemo<InputFilterData[]>(
    () => [
      {
        id: 'author-name-input',
        label: `${t('authorName')}:`,
        queryParam: QueryParams.AuthorName,
      },
      {
        id: 'author-orcid-input',
        label: `${t('authorOrcid')}:`,
        queryParam: QueryParams.AuthorOrcid,
      },
    ],
    [t],
  )

  return (
    <FilterSection title={t('nameOrId')}>
      <MultiInputFilter label={t('datasetIds')} filters={datasetIdFilters} />
      <MultiInputFilter label={t('author')} filters={authorFilters} />
    </FilterSection>
  )
}
