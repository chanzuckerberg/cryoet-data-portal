import { useMemo } from 'react'

import { InputFilterData, MultiInputFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

export function GeneOntologyFilter() {
  const { t } = useI18n()

  const GO_FILTER = useMemo<InputFilterData>(
    () => ({
      id: 'go-id-input',
      label: t('filterByGeneOntologyId'),
      queryParam: QueryParams.GoId,
      hideLabel: true,
    }),
    [t],
  )

  return (
    <MultiInputFilter
      label={t('goId')}
      title={t('filterByGeneOntologyId')}
      filters={[GO_FILTER]}
    />
  )
}
