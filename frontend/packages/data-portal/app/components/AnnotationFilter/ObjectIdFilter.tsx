import { RegexFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'
import { OBJECT_ID_REGEX } from 'app/utils/idPrefixes'

export function ObjectIdFilter() {
  const { t } = useI18n()

  return (
    <RegexFilter
      id="object-id-input"
      title={t('filterByObjectId')}
      label={t('objectId')}
      queryParam={QueryParams.ObjectId}
      regex={OBJECT_ID_REGEX}
    />
  )
}
