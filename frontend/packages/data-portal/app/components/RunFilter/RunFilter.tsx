import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  FilterPanel,
  FilterSection,
  GroundTruthAnnotationFilter,
  TiltRangeFilter,
} from 'app/components/Filters'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'

import { QualityScoreFilter } from './QualityScoreFilter'

export function RunFilter() {
  const { t } = useI18n()
  const { objectNames, objectShapeTypes } = useDatasetById()

  return (
    <FilterPanel>
      <FilterSection title={t('includedContents')}>
        <GroundTruthAnnotationFilter />
      </FilterSection>

      <FilterSection title={t('tiltSeriesMetadata')}>
        <QualityScoreFilter />
        <TiltRangeFilter />
      </FilterSection>

      <FilterSection title={t('annotationMetadata')} border={false}>
        <AnnotatedObjectNameFilter
          allObjectNames={objectNames}
          label={t('annotatedObjectName')}
        />
        <AnnotatedObjectShapeTypeFilter
          allObjectShapeTypes={objectShapeTypes}
        />
      </FilterSection>
    </FilterPanel>
  )
}
