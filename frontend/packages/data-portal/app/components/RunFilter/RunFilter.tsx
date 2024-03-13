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
    <div className="pl-sds-l flex flex-col gap-sds-xxs">
      <p className="text-sds-header-m leading-sds-header-m px-sds-s pt-sds-xl font-semibold">
        {t('filterBy')}:
      </p>

      <GroundTruthAnnotationFilter />
      <QualityScoreFilter />
      <TiltRangeFilter />
      <AnnotatedObjectNameFilter
        allObjectNames={objectNames}
        label={t('annotatedObjectName')}
      />
      <AnnotatedObjectShapeTypeFilter allObjectShapeTypes={objectShapeTypes} />
    </div>
  )
}
