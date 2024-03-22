import { FilterPanel } from 'app/components/FilterPanel'
import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  AuthorFilter,
} from 'app/components/Filters'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { AnnotationSoftwareFilter } from './AnnotationSoftwareFilter'
import { GeneOntologyFilter } from './GeneOntologyFilter'
import { MethodTypeFilter } from './MethodTypeFilter'

export function AnnotationFilter() {
  const { t } = useI18n()
  const showMethodType = useFeatureFlag('methodType')
  const { objectNames, objectShapeTypes, annotationSoftwares } = useRunById()

  return (
    <FilterPanel>
      <AuthorFilter label={t('annotationAuthor')} />
      <AnnotatedObjectNameFilter
        label={t('annotatedObjectName')}
        allObjectNames={objectNames}
      />
      <GeneOntologyFilter />
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
      {showMethodType && <MethodTypeFilter />}
      <AnnotationSoftwareFilter allAnnotationSoftwares={annotationSoftwares} />
    </FilterPanel>
  )
}
