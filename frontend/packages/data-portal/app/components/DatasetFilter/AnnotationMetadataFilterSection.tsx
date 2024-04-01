import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  FilterSection,
} from 'app/components/Filters'
import { useDatasets } from 'app/hooks/useDatasets'
import { useI18n } from 'app/hooks/useI18n'

export function AnnotationMetadataFilterSection() {
  const { objectNames, objectShapeTypes } = useDatasets()

  const { t } = useI18n()

  return (
    <FilterSection title={t('annotationMetadata')}>
      <AnnotatedObjectNameFilter
        allObjectNames={objectNames}
        label={t('objectName')}
      />

      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
    </FilterSection>
  )
}
