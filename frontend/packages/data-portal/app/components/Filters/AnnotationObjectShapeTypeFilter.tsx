import { useMemo } from 'react'

import { shapeTypeToI18nKey } from 'app/constants/objectShapeTypes'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { BaseFilterOption } from 'app/types/filter'
import { I18nKeys } from 'app/types/i18n'
import { ObjectShapeType } from 'app/types/shapeTypes'

import { SelectFilter } from './SelectFilter'

function getObjectShapeTypeOptions(
  objectShapeTypes: string[],
  t: ReturnType<typeof useI18n>['t'],
): BaseFilterOption[] {
  return objectShapeTypes.map((value) => ({
    label: t(
      shapeTypeToI18nKey.get(value as ObjectShapeType) ?? ('' as I18nKeys),
    ),
    value,
  }))
}

export function AnnotatedObjectShapeTypeFilter({
  allObjectShapeTypes,
}: {
  allObjectShapeTypes: string[]
}) {
  const { t } = useI18n()

  const {
    updateValue,
    annotation: { objectShapeTypes },
  } = useFilter()

  const objectShapeTypeOptions = useMemo(
    () => getObjectShapeTypeOptions(allObjectShapeTypes, t),
    [allObjectShapeTypes, t],
  )

  const objectShapeTypeValue = useMemo(
    () => getObjectShapeTypeOptions(objectShapeTypes, t),
    [objectShapeTypes, t],
  )

  return (
    <SelectFilter
      multiple
      label={t('objectShapeType')}
      onChange={(options) => updateValue(QueryParams.ObjectShapeType, options)}
      options={objectShapeTypeOptions}
      value={objectShapeTypeValue}
    />
  )
}
