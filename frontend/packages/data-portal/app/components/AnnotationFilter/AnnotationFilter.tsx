import { FilterPanel } from 'app/components/FilterPanel'
import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  AuthorFilter,
} from 'app/components/Filters'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'

export function AnnotationFilter() {
  const { t } = useI18n()
  const { objectNames, objectShapeTypes } = useRunById()

  return (
    <FilterPanel>
      <AuthorFilter />
      <AnnotatedObjectNameFilter
        label={t('annotatedObjectName')}
        allObjectNames={objectNames}
      />
      {/* GO ID */}
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
      {/* Method Type */}
      {/* Annotation Software */}
    </FilterPanel>
  )
}
