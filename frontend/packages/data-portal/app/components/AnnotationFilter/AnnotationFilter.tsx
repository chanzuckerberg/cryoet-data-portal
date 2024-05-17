import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  AuthorFilter,
  FilterPanel,
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
      <div className="pl-sds-l py-sds-default flex-col gap-sds-xxs">
        <AuthorFilter label={t('annotationAuthor')} />
        <AnnotatedObjectNameFilter
          label={t('objectName')}
          allObjectNames={objectNames}
        />
        <GeneOntologyFilter />
        <AnnotatedObjectShapeTypeFilter
          allObjectShapeTypes={objectShapeTypes}
        />
        {showMethodType && <MethodTypeFilter />}
        <AnnotationSoftwareFilter
          allAnnotationSoftwares={annotationSoftwares}
        />
      </div>
    </FilterPanel>
  )
}
