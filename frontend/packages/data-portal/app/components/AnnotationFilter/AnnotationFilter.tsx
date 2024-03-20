import { FilterPanel } from 'app/components/FilterPanel'
import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  AuthorFilter,
} from 'app/components/Filters'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'

import { GeneOntologyFilter } from './GeneOntologyFilter'

export function AnnotationFilter() {
  const { t } = useI18n()
  const { objectNames, objectShapeTypes } = useRunById()

  return (
    <FilterPanel>
      <AuthorFilter label={t('annotationAuthor')} />
      <AnnotatedObjectNameFilter
        label={t('annotatedObjectName')}
        allObjectNames={objectNames}
      />
      <GeneOntologyFilter />
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
      {/* Method Type */}
      {/* Annotation Software */}
    </FilterPanel>
  )
}
