import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'

import { MiniTag } from '../common/MiniTag/MiniTag'
import { BooleanFilter } from './BooleanFilter'

export function GroundTruthAnnotationFilter() {
  const { t } = useI18n()
  const {
    updateValue,
    includedContents: { isGroundTruthEnabled },
  } = useFilter()

  return (
    <>
      <div className="flex items-baseline">
        <BooleanFilter
          label={t('groundTruthAnnotationAvailableFilter')}
          onChange={(value) =>
            updateValue(
              QueryParams.GroundTruthAnnotation,
              value ? 'true' : null,
            )
          }
          value={isGroundTruthEnabled}
          wrapped
          hasTag
        />
        <div className="relative top-[9px]">
          <MiniTag>{t('gT')}</MiniTag>
        </div>
      </div>
    </>
  )
}
