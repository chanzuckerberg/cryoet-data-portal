import {
  SegmentedControl,
  type SingleButtonDefinition,
} from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { useSearchParams } from '@remix-run/react'
import { useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import { useActiveDepositionDataType } from 'app/hooks/useActiveDepositionDataType'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useDepositionGroupedData } from 'app/hooks/useDepositionGroupedData'
import { useGroupBy } from 'app/hooks/useGroupBy'
import { useI18n } from 'app/hooks/useI18n'
import { DataContentsType } from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'
import { I18nKeys } from 'app/types/i18n'
import { cns } from 'app/utils/cns'
import { isDefined } from 'app/utils/nullish'

import styles from './DepositionGroupByControl.module.css'

export function DepositionGroupByControl() {
  const { t } = useI18n()

  const [groupBy] = useGroupBy({ preventScrollReset: true })
  const [, setSearchParams] = useSearchParams()

  const groupByOptions = useGroupByOptions()

  const handleGroupByChange = (value: GroupByOption) => {
    // Remove the page parameter when group by changes
    setSearchParams(
      (prev) => {
        prev.set(QueryParams.GroupBy, value)
        prev.delete(QueryParams.Page)
        return prev
      },
      { preventScrollReset: true },
    )
  }

  return (
    <div className="flex items-center gap-sds-m">
      <span className="text-sds-header-s-600-wide tracking-sds-header-s-600-wide font-semibold">
        {t('groupBy')}
      </span>

      <SegmentedControl
        buttonDefinition={groupByOptions}
        value={groupBy}
        onChange={(_, value) => handleGroupByChange(value as GroupByOption)}
        className={cns(
          'h-[30px]',
          styles.segmentedControl,
          groupBy === GroupByOption.None && styles.none,
          groupBy === GroupByOption.DepositedLocation &&
            styles.depositedLocation,
          groupBy === GroupByOption.Organism && styles.organism,
        )}
      />
    </div>
  )
}

function useGroupByOptions(): SingleButtonDefinition[] {
  const { t } = useI18n()
  const { annotationsCount, tomogramsCount } = useDepositionById()
  const [type] = useActiveDepositionDataType()

  const count =
    type === DataContentsType.Annotations ? annotationsCount : tomogramsCount

  // Use the new consolidated hook for fetching data
  const { datasets, isLoading } = useDepositionGroupedData({
    enabled: count > 0,
  })

  return useMemo(() => {
    const groupCounts = {
      [GroupByOption.DepositedLocation]: 0,
      [GroupByOption.Organism]: 0,
    }

    if (!isLoading) {
      // Calculate actual dataset count (unique datasets)
      groupCounts[GroupByOption.DepositedLocation] = new Set(
        datasets.map((dataset) => dataset.id),
      ).size

      // Calculate actual organism count (unique organism names)
      groupCounts[GroupByOption.Organism] = new Set(
        datasets.map((dataset) => dataset.organismName).filter(isDefined),
      ).size
    }

    const createButtonDefinition = (
      value: GroupByOption,
      i18nKey: I18nKeys,
    ): SingleButtonDefinition => {
      const label = t(i18nKey)
      const buttonCount =
        value === GroupByOption.None ? 0 : groupCounts[value] || 0

      return {
        value,
        tooltipText: label,
        disabled: value !== GroupByOption.None && buttonCount === 0,
        icon: (
          <div className="flex items-center gap-sds-s">
            <span>{label}</span>

            {value !== GroupByOption.None &&
              (isLoading ? (
                <Skeleton variant="text" className="w-[20px] !h-[20px]" />
              ) : (
                <span>{buttonCount}</span>
              ))}
          </div>
        ),
      }
    }

    return [
      createButtonDefinition(GroupByOption.None, 'none'),
      createButtonDefinition(GroupByOption.DepositedLocation, 'location'),
      createButtonDefinition(GroupByOption.Organism, 'organism'),
    ]
  }, [datasets, isLoading, t])
}
