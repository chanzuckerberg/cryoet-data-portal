import { useMemo } from 'react'

import { Annotation_File_Shape_Type_Enum } from 'app/__generated_v2__/graphql'
import { getShapeTypeI18nKey } from 'app/constants/objectShapeTypes'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { BaseFilterOption } from 'app/types/filter'

import { SelectFilter } from './SelectFilter'

function getObjectShapeTypeOptions(
  objectShapeTypes: Annotation_File_Shape_Type_Enum[],
  t: ReturnType<typeof useI18n>['t'],
): BaseFilterOption[] {
  return objectShapeTypes.map((value) => ({
    label: t(getShapeTypeI18nKey(value)),
    value,
  }))
}

export function AnnotatedObjectShapeTypeFilter({
  allObjectShapeTypes,
}: {
  allObjectShapeTypes: Annotation_File_Shape_Type_Enum[]
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
