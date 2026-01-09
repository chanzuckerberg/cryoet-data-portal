import {
  AnnotatedObjectShapeTypeFilter,
  FilterSection,
} from 'app/components/Filters'
import { ObjectNameIdFilter } from 'app/components/Filters/ObjectNameIdFilter/ObjectNameIdFilter'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
import { useI18n } from 'app/hooks/useI18n'

export function AnnotationMetadataFilterSection() {
  const { objectNames, objectShapeTypes } = useDatasetsFilterData()
  const { t } = useI18n()

  return (
    <FilterSection title={t('objectMetadata')}>
      <ObjectNameIdFilter
        label={t('objectNameOrId')}
        objectNames={objectNames}
      />
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
    </FilterSection>
  )
}
