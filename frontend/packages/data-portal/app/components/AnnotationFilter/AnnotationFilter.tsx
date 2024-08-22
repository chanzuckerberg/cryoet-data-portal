import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  AuthorFilter,
  FilterPanel,
} from 'app/components/Filters'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'

import { AnnotationSoftwareFilter } from './AnnotationSoftwareFilter'
import { MethodTypeFilter } from './MethodTypeFilter'
import { ObjectIdFilter } from './ObjectIdFilter'

export function AnnotationFilter() {
  const { t } = useI18n()
  const { objectNames, objectShapeTypes, annotationSoftwares } = useRunById()

  return (
    <FilterPanel>
      <div className="pl-sds-l py-sds-default flex-col gap-sds-xxs">
        <AuthorFilter label={t('annotationAuthor')} />
        <AnnotatedObjectNameFilter
          label={t('objectName')}
          allObjectNames={objectNames}
        />
        <ObjectIdFilter />
        <AnnotatedObjectShapeTypeFilter
          allObjectShapeTypes={objectShapeTypes}
        />
        <MethodTypeFilter />
        <AnnotationSoftwareFilter
          allAnnotationSoftwares={annotationSoftwares}
        />
      </div>
    </FilterPanel>
  )
}
