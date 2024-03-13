import { useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { BaseFilterOption } from 'app/types/filter'

import { SelectFilter } from './SelectFilter'

function getObjectShapeTypeOptions(
  objectShapeTypes: string[],
): BaseFilterOption[] {
  return objectShapeTypes.map((value) => ({ value }))
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
    () => getObjectShapeTypeOptions(allObjectShapeTypes),
    [allObjectShapeTypes],
  )

  const objectShapeTypeValue = useMemo(
    () => getObjectShapeTypeOptions(objectShapeTypes),
    [objectShapeTypes],
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
