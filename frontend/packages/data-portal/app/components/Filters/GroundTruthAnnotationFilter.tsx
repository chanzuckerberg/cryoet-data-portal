import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'

import { MiniTag } from '../common/MiniTag/MiniTag'
import { BooleanFilter } from './BooleanFilter'

export function GroundTruthAnnotationFilter({
  depositionPageVariant,
}: {
  depositionPageVariant?: boolean
}) {
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
          // FIXME: once sds upgraded to 0.20.x uncomment this
          // caption={
          //   depositionPageVariant ? t('depositionAnnotationsOnly') : undefined
          // }
        />
        <div className="relative top-[9px]">
          <MiniTag>{t('gT')}</MiniTag>
        </div>
      </div>
      {/* FIXME: once sds upgraded to 0.20.x delete below line and remove fragment wrapper */}
      {depositionPageVariant && (
        <p className="pl-[32px] -mt-sds-xs text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-primitive-gray-500">
          {t('depositionAnnotationsOnly')}
        </p>
      )}
    </>
  )
}
