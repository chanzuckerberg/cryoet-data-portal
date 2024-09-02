import { NameOrIdFilterSection } from 'app/components/DepositionFilter'
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
import { useFeatureFlag } from 'app/utils/featureFlags'

import { ObjectIdFilter } from '../AnnotationFilter/ObjectIdFilter'
import { QualityScoreFilter } from './QualityScoreFilter'

export function RunFilter() {
  const { t } = useI18n()
  const showDepositions = useFeatureFlag('depositions')
  const { objectNames, objectShapeTypes } = useDatasetById()

  return (
    <FilterPanel>
      <FilterSection title={t('includedContents')}>
        <GroundTruthAnnotationFilter />
      </FilterSection>

      {showDepositions && <NameOrIdFilterSection />}

      <FilterSection title={t('tiltSeriesMetadata')}>
        <QualityScoreFilter />
        <TiltRangeFilter />
      </FilterSection>

      <FilterSection title={t('annotationMetadata')} border={false}>
        <AnnotatedObjectNameFilter
          allObjectNames={objectNames}
          label={t('objectName')}
        />
        {showDepositions && <ObjectIdFilter />}
        <AnnotatedObjectShapeTypeFilter
          allObjectShapeTypes={objectShapeTypes}
        />
      </FilterSection>
    </FilterPanel>
  )
}
