import { useSearchParams } from '@remix-run/react'

import { NameOrIdFilterSection } from 'app/components/DepositionFilter'
import {
  AnnotatedObjectShapeTypeFilter,
  AuthorFilter,
  FilterPanel,
  FilterSection,
} from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'

import { ObjectNameIdFilter } from '../Filters/ObjectNameIdFilter/ObjectNameIdFilter'
import { AnnotationSoftwareFilter } from './AnnotationSoftwareFilter'
import { MethodTypeFilter } from './MethodTypeFilter'

export function AnnotationFilter() {
  const { t } = useI18n()
  const [searchParams] = useSearchParams()
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

  return (
    <FilterPanel>
      <>
        <NameOrIdFilterSection />
        <FilterSection title={t('objectMetadata')}>
          <ObjectNameIdFilter
            label={t('objectNameOrId')}
            objectNames={allObjectNames}
            showAnnotatedObjectsOnly={showAnnotatedObjectsOnly}
          />
          <AnnotatedObjectShapeTypeFilter
            allObjectShapeTypes={objectShapeTypes}
          />
        </FilterSection>
        <FilterSection title={t('annotationMetadata')}>
          <AuthorFilter label={t('annotationAuthor')} />
          <MethodTypeFilter />
          <AnnotationSoftwareFilter
            allAnnotationSoftwares={annotationSoftwares}
          />
        </FilterSection>
      </>
    </FilterPanel>
  )
}
