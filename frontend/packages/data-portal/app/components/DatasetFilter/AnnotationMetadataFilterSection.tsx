import { useMemo } from 'react'

import {
  AnnotatedObjectNameFilter,
  FilterSection,
  SelectFilter,
} from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useDatasets } from 'app/hooks/useDatasets'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { BaseFilterOption } from 'app/types/filter'

export function AnnotationMetadataFilterSection() {
  const { objectNames, objectShapeTypes: allObjectShapeTypes } = useDatasets()
  const {
    updateValue,
    annotation: { objectShapeTypes },
  } = useFilter()

  const objectShapeTypeOptions = useMemo(
    () => allObjectShapeTypes.map<BaseFilterOption>((value) => ({ value })),
    [allObjectShapeTypes],
  )

  const objectShapeTypeValue = useMemo<BaseFilterOption[]>(
    () => objectShapeTypes.map((value) => ({ value })),
    [objectShapeTypes],
  )

  const { t } = useI18n()

  return (
    <FilterSection title={t('annotationMetadata')}>
      <AnnotatedObjectNameFilter
        allObjectNames={objectNames}
        label={t('objectName')}
      />

      <SelectFilter
        multiple
        options={objectShapeTypeOptions}
        value={objectShapeTypeValue}
        label={t('objectShapeType')}
        onChange={(options) =>
          updateValue(QueryParams.ObjectShapeType, options)
        }
      />
    </FilterSection>
  )
}
