import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'

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
      <BooleanFilter
        label={t('groundTruthAnnotation')}
        onChange={(value) =>
          updateValue(QueryParams.GroundTruthAnnotation, value ? 'true' : null)
        }
        value={isGroundTruthEnabled}
        // FIXME: once sds upgraded to 0.20.x uncomment this
        // caption={
        //   depositionPageVariant ? t('depositionAnnotationsOnly') : undefined
        // }
      />
      {/* FIXME: once sds upgraded to 0.20.x delete below line and remove fragment wrapper */}
      {depositionPageVariant && (
        <p className="pl-9 text-sds-body-xxs leading-sds-body-xxs text-light-sds-color-primitive-gray-500">
          {t('depositionAnnotationsOnly')}
        </p>
      )}
    </>
  )
}
