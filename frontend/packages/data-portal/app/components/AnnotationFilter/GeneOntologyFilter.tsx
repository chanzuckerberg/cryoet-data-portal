import { IDFilter } from 'app/components/Filters'
import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

export function GeneOntologyFilter() {
  const { t } = useI18n()

  return (
    <IDFilter
      id="go-id-input"
      title={t('filterByGeneOntologyId')}
      label={t('goId')}
      queryParam={QueryParams.GoId}
      prefix={IdPrefix.GeneOntology}
    />
  )
}
