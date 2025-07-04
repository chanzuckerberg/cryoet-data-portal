import { NameOrIdFilterSection } from 'app/components/DepositionFilter'
import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  AuthorFilter,
  FilterPanel,
  FilterSection,
} from 'app/components/Filters'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { ObjectNameIdFilter } from '../Filters/ObjectNameIdFilter/ObjectNameIdFilter'
import { AnnotationSoftwareFilter } from './AnnotationSoftwareFilter'
import { MethodTypeFilter } from './MethodTypeFilter'
import { ObjectIdFilter } from './ObjectIdFilter/ObjectIdFilter'

export function AnnotationFilter() {
  const { t } = useI18n()
  const showObjectNameIdFilter = useFeatureFlag('identifiedObjects')
  const { objectNames, objectShapeTypes, annotationSoftwares } = useRunById()

  const annotationMetadataFilters = (
    <>
      <AuthorFilter label={t('annotationAuthor')} />
      <AnnotatedObjectNameFilter
        label={t('objectName')}
        allObjectNames={objectNames}
      />
      <ObjectIdFilter />
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
      <MethodTypeFilter />
      <AnnotationSoftwareFilter allAnnotationSoftwares={annotationSoftwares} />
    </>
  )

  const objectMetadataFilters = (
    <>
      <ObjectNameIdFilter
        label={t('objectNameOrId')}
        objectNames={objectNames}
        showAnnotatedObjectsOnly={false}
      />
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
    </>
  )

  const otherAnnotationMetadataFilters = (
    <>
      <AuthorFilter label={t('annotationAuthor')} />
      <MethodTypeFilter />
      <AnnotationSoftwareFilter allAnnotationSoftwares={annotationSoftwares} />
    </>
  )

  return (
    <FilterPanel>
      <>
        <NameOrIdFilterSection />
        {showObjectNameIdFilter ? (
          <>
            <FilterSection title={t('objectMetadata')}>
              {objectMetadataFilters}
            </FilterSection>
            <FilterSection title={t('annotationMetadata')}>
              {otherAnnotationMetadataFilters}
            </FilterSection>
          </>
        ) : (
          <FilterSection title={t('annotationMetadata')}>
            {annotationMetadataFilters}
          </FilterSection>
        )}
      </>
    </FilterPanel>
  )
}
