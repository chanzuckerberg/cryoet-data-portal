import { NameOrIdFilterSection } from 'app/components/DepositionFilter'
import {
  AnnotatedObjectShapeTypeFilter,
  FilterPanel,
  FilterSection,
  GroundTruthAnnotationFilter,
  TiltRangeFilter,
} from 'app/components/Filters'
import { ObjectNameIdFilter } from 'app/components/Filters/ObjectNameIdFilter/ObjectNameIdFilter'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'

import { QualityScoreFilter } from './QualityScoreFilter'

export function RunFilter() {
  const { t } = useI18n()
  const { objectNames, objectShapeTypes } = useDatasetById()

  return (
    <FilterPanel>
      <FilterSection title={t('runContents')}>
        <GroundTruthAnnotationFilter />
      </FilterSection>

      <NameOrIdFilterSection />

      <FilterSection title={t('objectMetadata')}>
        <ObjectNameIdFilter
          label={t('objectNameOrId')}
          objectNames={objectNames}
        />
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
