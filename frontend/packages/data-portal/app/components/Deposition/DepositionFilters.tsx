import { useMemo } from 'react'

import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'
import { getDataContents } from 'app/utils/deposition'

import { DepositionTabs } from './DepositionTabs'

export function DepositionFilters() {
  const { allRuns } = useDepositionById()
  const dataContents = getDataContents(allRuns)
  const dataContentItems = useMemo(
    () =>
      [
        {
          label: 'tiltSeries',
          isAvailable: dataContents.tiltSeriesAvailable,
        },
        {
          label: 'frames',
          isAvailable: dataContents.framesAvailable,
        },
        {
          label: 'ctf',
          isAvailable: dataContents.ctfAvailable,
        },
        {
          label: 'alignment',
          isAvailable: dataContents.alignmentAvailable,
        },
      ] as const,
    [dataContents],
  )

  const { t } = useI18n()

  return (
    <div className="flex flex-col pt-sds-xl">
      <h4
        className={cns(
          'text-sds-header-m-600-wide tracking-sds-header-m-600-wide',
          'font-semibold leading-sds-header-m px-sds-xl mb-sds-s',
        )}
      >
        {t('dataContents')}
      </h4>

      <DepositionTabs />

      <div className="flex flex-col justify-between gap-sds-s mt-sds-l">
        {dataContentItems.map(({ label, isAvailable }) => (
          <div
            key={label}
            className={cns(
              'flex items-center justify-between px-sds-xl',
              'text-sds-body-xs-400-wide tracking-sds-body-xs-400-wide leading-sds-body-xs',
              'text-light-sds-color-semantic-base-text-secondary',
            )}
          >
            <span>{t(label)}</span>

            <span>{t(isAvailable ? 'available' : 'na')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
