import { useSearchParams } from '@remix-run/react'

import { NameOrIdFilterSection } from 'app/components/DepositionFilter'
import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  AuthorFilter,
  FilterPanel,
  FilterSection,
} from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { ObjectNameIdFilter } from '../Filters/ObjectNameIdFilter/ObjectNameIdFilter'
import { AnnotationSoftwareFilter } from './AnnotationSoftwareFilter'
import { MethodTypeFilter } from './MethodTypeFilter'
import { ObjectIdFilter } from './ObjectIdFilter/ObjectIdFilter'

export function AnnotationFilter() {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
  const showObjectNameIdFilter = useFeatureFlag('identifiedObjects')
  const {
    objectNames,
    objectShapeTypes,
    annotationSoftwares,
    identifiedObjectsData,
  } = useRunById()

  // Show annotated objects only checkbox if the parameter is present in URL
  const showAnnotatedObjectsOnly = searchParams.has(
    QueryParams.AnnotatedObjectsOnly,
  )

  // Merge annotation and identified object names for filter dropdown
  const identifiedObjectNames = identifiedObjectsData
    .map((item) => item.objectName)
    .filter((name): name is string => Boolean(name))

  const allObjectNames = Array.from(
    new Set([...objectNames, ...identifiedObjectNames]),
  )

  const annotationMetadataFilters = (
    <>
      <AuthorFilter label={t('annotationAuthor')} />
      <AnnotatedObjectNameFilter
        label={t('objectName')}
        allObjectNames={allObjectNames}
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
        objectNames={allObjectNames}
        showAnnotatedObjectsOnly={showAnnotatedObjectsOnly}
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
