import { NameOrIdFilterSection } from 'app/components/DepositionFilter'
import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
  FilterPanel,
  FilterSection,
  GroundTruthAnnotationFilter,
  TiltRangeFilter,
} from 'app/components/Filters'
import { ObjectNameIdFilter } from 'app/components/Filters/ObjectNameIdFilter/ObjectNameIdFilter'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { ObjectIdFilter } from '../AnnotationFilter/ObjectIdFilter/ObjectIdFilter'
import { QualityScoreFilter } from './QualityScoreFilter'

export function RunFilter() {
  const { t } = useI18n()
  const showDepositions = useFeatureFlag('depositions')
  const showObjectNameIdFilter = useFeatureFlag('identifiedObjects')
  const { objectNames, objectShapeTypes } = useDatasetById()

  return (
    <FilterPanel>
      <FilterSection title={t('runContents')}>
        <GroundTruthAnnotationFilter />
      </FilterSection>

      {showDepositions && <NameOrIdFilterSection />}

      <FilterSection title={t('objectMetadata')}>
        {showObjectNameIdFilter ? (
          <ObjectNameIdFilter
            label={t('objectNameOrId')}
            objectNames={objectNames}
          />
        ) : (
          <>
            <AnnotatedObjectNameFilter
              allObjectNames={objectNames}
              label={t('objectName')}
            />
            <ObjectIdFilter />
          </>
        )}
        <AnnotatedObjectShapeTypeFilter
          allObjectShapeTypes={objectShapeTypes}
        />
      </FilterSection>

      <FilterSection title={t('tiltSeriesMetadata')}>
        <QualityScoreFilter />
        <TiltRangeFilter />
      </FilterSection>
    </FilterPanel>
  )
}
