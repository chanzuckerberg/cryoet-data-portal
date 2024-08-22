import { useMemo } from 'react'

import { InputFilterData, MultiInputFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'

export function ObjectIdFilter() {
  const { t } = useI18n()

  const ID_FILTER = useMemo<InputFilterData>(
    () => ({
      id: 'object-id-input',
      label: t('filterByObjectId'),
      queryParam: QueryParams.ObjectId,
      hideLabel: true,
    }),
    [t],
  )

  return (
    <MultiInputFilter
      label={t('objectId')}
      title={t('filterByObjectId')}
      filters={[ID_FILTER]}
    />
  )
}
