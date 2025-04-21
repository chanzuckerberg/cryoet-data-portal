import { EntityIdFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

export function DepositionIdFilter() {
  const { t } = useI18n()

  return (
    <EntityIdFilter
      id="deposition-id-input"
      title={`${t('filterByDepositionId')}:`}
      label={t('depositionId')}
      queryParam={QueryParams.DepositionId}
      placeholder={t('depositionIdPlaceholder')}
    />
  )
}
