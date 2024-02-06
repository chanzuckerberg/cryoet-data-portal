import { TiltRangeFilter } from 'app/components/Filters'
import { useI18n } from 'app/hooks/useI18n'

import { QualityScoreFilter } from './QualityScoreFilter'

export function RunFilter() {
  const { t } = useI18n()

  return (
    <div className="px-sds-l flex flex-col gap-1">
      <p className="text-sds-header-m leading-sds-header-m px-sds-s pt-sds-xl font-semibold">
        {t('filterBy')}:
      </p>

      <QualityScoreFilter />
      <TiltRangeFilter />
    </div>
  )
}
