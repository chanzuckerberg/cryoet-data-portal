import { IDFilter } from 'app/components/Filters'
import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

export function DepositionIdFilter() {
  const { t } = useI18n()

  return (
    <IDFilter
      id="deposition-id-input"
      title={t('filterByDepositionId')}
      label={t('depositionId')}
      queryParam={QueryParams.DepositionId}
      prefix={IdPrefix.Deposition}
    />
  )
}
