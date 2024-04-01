import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'

import { BooleanFilter } from './BooleanFilter'

export function GroundTruthAnnotationFilter() {
  const { t } = useI18n()
  const {
    updateValue,
    includedContents: { isGroundTruthEnabled },
  } = useFilter()

  return (
    <BooleanFilter
      label={t('groundTruthAnnotation')}
      onChange={(value) =>
        updateValue(QueryParams.GroundTruthAnnotation, value ? 'true' : null)
      }
      value={isGroundTruthEnabled}
    />
  )
}
