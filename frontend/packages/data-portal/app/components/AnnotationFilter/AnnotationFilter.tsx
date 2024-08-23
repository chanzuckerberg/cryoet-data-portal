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

import { AnnotationSoftwareFilter } from './AnnotationSoftwareFilter'
import { GeneOntologyFilter } from './GeneOntologyFilter'
import { MethodTypeFilter } from './MethodTypeFilter'

export function AnnotationFilter() {
  const { t } = useI18n()
  const showDepositions = useFeatureFlag('depositions')
  const { objectNames, objectShapeTypes, annotationSoftwares } = useRunById()

  const annotationMetadataFilters = (
    <>
      <AuthorFilter label={t('annotationAuthor')} />
      <AnnotatedObjectNameFilter
        label={t('objectName')}
        allObjectNames={objectNames}
      />
      <GeneOntologyFilter />
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
      <MethodTypeFilter />
      <AnnotationSoftwareFilter allAnnotationSoftwares={annotationSoftwares} />
    </>
  )

  return (
    <FilterPanel>
      {showDepositions ? (
        <>
          <NameOrIdFilterSection />
          <FilterSection title={t('annotationMetadata')}>
            {annotationMetadataFilters}
          </FilterSection>
        </>
      ) : (
        <div className="pl-sds-l py-sds-default flex-col gap-sds-xxs">
          {annotationMetadataFilters}
        </div>
      )}
    </FilterPanel>
  )
}
