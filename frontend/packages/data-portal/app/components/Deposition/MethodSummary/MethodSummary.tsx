import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { MethodSummaryAcquisitionTable } from './MethodSummaryAcquisitionTable'
import { MethodSummaryAnnotationTable } from './MethodSummaryAnnotationTable'
import { MethodSummaryExperimentalConditionsTable } from './MethodSummaryExperimentalConditionsTable'
import { MethodSummaryTabs } from './MethodSummaryTabs'
import { MethodSummaryTomogramsTable } from './MethodSummaryTomogramsTable'
import { MethodSummaryTab } from './types'
import { useMethodSummaryTab } from './useMethodSummaryTab'

export function MethodSummary() {
  const { t } = useI18n()
  const [tab] = useMethodSummaryTab()

  return (
    <div className="p-4 bg-light-sds-color-primitive-gray-75">
      <div className="flex items-center gap-sds-xl mb-4 flex-wrap overflow-y-hidden overflow-x-auto">
        <h2
          className={cns(
            'font-semibold leading-sds-header-l',
            'text-sds-header-l-600-wide tracking-sds-header-l-600-wide',
            'sticky left-0',
          )}
        >
          {t('methodsSummary')}
        </h2>

        <MethodSummaryTabs />
      </div>

      {tab === MethodSummaryTab.Annotations && <MethodSummaryAnnotationTable />}
      {tab === MethodSummaryTab.Tomograms && <MethodSummaryTomogramsTable />}

      {tab === MethodSummaryTab.Acquisition && (
        <MethodSummaryAcquisitionTable />
      )}

      {tab === MethodSummaryTab.ExperimentalConditions && (
        <MethodSummaryExperimentalConditionsTable />
      )}
    </div>
  )
}
