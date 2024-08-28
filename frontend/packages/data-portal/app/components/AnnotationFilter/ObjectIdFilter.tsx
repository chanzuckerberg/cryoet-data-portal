import { RegexFilter } from 'app/components/Filters'
import {
  GO_PREFIX,
  UNIPROTKB_PREFIX,
} from 'app/constants/annotationObjectIdLinks'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

export function ObjectIdFilter() {
  const { t } = useI18n()

  return (
    <RegexFilter
      id="object-id-input"
      title={t('filterByObjectId')}
      label={t('objectId')}
      queryParam={QueryParams.ObjectId}
      regex={RegExp(`^(?:${GO_PREFIX}|${UNIPROTKB_PREFIX}).+$`)}
    />
  )
}
