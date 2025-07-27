import Divider from '@mui/material/Divider'
import { useParams } from '@remix-run/react'
import { useMemo } from 'react'

import { OrganismNameFilter } from 'app/components/Filters/OrganismNameFilter'
import { QueryParams } from 'app/constants/query'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useDepositionGroupedData } from 'app/hooks/useDepositionGroupedData'
import { useDepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { useQueryParam } from 'app/hooks/useQueryParam'
import { GroupByOption } from 'app/types/depositionTypes'
import { cns } from 'app/utils/cns'
import { getDataContents } from 'app/utils/deposition'
import { isDefined } from 'app/utils/nullish'

import { DatasetNameOrIdFilter } from '../Filters/DatasetNameOrIdFilter'
import { DepositionTabs } from './DepositionTabs'

export function DepositionFilters() {
  const params = useParams()
  const depositionId = params.id ? +params.id : undefined
  const [tab] = useDepositionTab()
  const { allRuns } = useDepositionById()

  // Get current groupBy value from URL params
  const [groupBy] = useQueryParam<GroupByOption>(QueryParams.GroupBy, {
    defaultValue: GroupByOption.None,
    serialize: (value) => String(value),
    deserialize: (value) => (value as GroupByOption) || GroupByOption.None,
  })

  // Use the new hook to get datasets
  const { datasets } = useDepositionGroupedData(
    {
      depositionId,
      groupBy: groupBy || GroupByOption.None,
      tab,
    },
    {
      fetchRunCounts: false, // Only need organism names
    },
  )

  // Extract unique organism names from datasets
  const organismNames = useMemo(
    () =>
      [
        ...new Set(datasets.map((d) => d.organismName).filter(isDefined)),
      ].sort(),
    [datasets],
  )
  const dataContents = getDataContents(allRuns ?? [])
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

      <Divider className="bg-light-sds-color-semantic-base-divider h-[3px] !mt-[60px] !mb-sds-xl" />

      <div>
        <h3
          className={cns(
            'text-sds-header-m-600-wide font-semibold',
            'tracking-sds-header-m-600-wide leading-sds-header-m',
            'px-sds-xl mb-sds-s',
          )}
        >
          {t('filterBy')}:
        </h3>

        <div className="px-sds-l flex flex-col gap-sds-xxs pb-sds-xl">
          <DatasetNameOrIdFilter />
          <OrganismNameFilter organismNames={organismNames} />
        </div>
      </div>
    </div>
  )
}
