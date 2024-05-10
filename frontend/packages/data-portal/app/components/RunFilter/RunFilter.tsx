import { FilterPanel } from 'app/components/FilterPanel'
import {
  AnnotatedObjectNameFilter,
  AnnotatedObjectShapeTypeFilter,
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
      <GroundTruthAnnotationFilter />
      <QualityScoreFilter />
      <TiltRangeFilter />
      <AnnotatedObjectNameFilter
        allObjectNames={objectNames}
        label={t('annotatedObjectName')}
      />
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
    </FilterPanel>
  )
}
