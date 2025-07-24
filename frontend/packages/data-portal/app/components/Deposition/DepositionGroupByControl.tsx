import {
  SegmentedControl,
  type SingleButtonDefinition,
} from '@czi-sds/components'
import { useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { useQueryParam } from 'app/hooks/useQueryParam'
import { useDatasetsForDeposition } from 'app/queries/useDatasetsForDeposition'
import { GroupByOption } from 'app/types/depositionTypes'
import { cns } from 'app/utils/cns'
import { isDefined } from 'app/utils/nullish'

import styles from './DepositionGroupByControl.module.css'

export function DepositionGroupByControl() {
  const { t } = useI18n()

  const [groupBy, setGroupBy] = useQueryParam<GroupByOption>(
    QueryParams.GroupBy,
    {
      defaultValue: GroupByOption.None,
      serialize: (value) => String(value),
      deserialize: (value) => (value as GroupByOption) || GroupByOption.None,
      preventScrollReset: true,
    },
  )

  const groupByOptions = useGroupByOptions()

  const handleGroupByChange = (value: GroupByOption) => {
    setGroupBy(value)
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
  const { annotationsCount, deposition } = useDepositionById()
  const { data: datasets = [], isLoading } = useDatasetsForDeposition(
    deposition?.id,
  )

  return useMemo(() => {
    const groupCounts = {
      [GroupByOption.DepositedLocation]: 0,
      [GroupByOption.Organism]: 0,
    }

    if (annotationsCount > 0 && !isLoading) {
      // Calculate actual dataset count (unique datasets)
      groupCounts[GroupByOption.DepositedLocation] = new Set(
        datasets.map((dataset) => dataset.id),
      ).size

      // Calculate actual organism count (unique organism names)
      groupCounts[GroupByOption.Organism] = new Set(
        datasets.map((dataset) => dataset.organismName).filter(isDefined),
      ).size
    }

    return [
      {
        value: GroupByOption.None,
        tooltipText: t('none'),
        icon: (
          <div className="flex items-center gap-sds-s">
            <span>{t('none')}</span>
          </div>
        ),
      },
      {
        value: GroupByOption.DepositedLocation,
        tooltipText: t('location'),
        icon: (
          <div className="flex items-center gap-sds-s">
            <span>{t('location')}</span>

            {groupCounts[GroupByOption.DepositedLocation] > 0 && (
              <span>{groupCounts[GroupByOption.DepositedLocation]}</span>
            )}
          </div>
        ),
      },
      {
        value: GroupByOption.Organism,
        tooltipText: t('organism'),
        icon: (
          <div className="flex items-center gap-sds-s">
            <span>{t('organism')}</span>

            {groupCounts[GroupByOption.Organism] > 0 && (
              <span>{groupCounts[GroupByOption.Organism]}</span>
            )}
          </div>
        ),
      },
    ]
  }, [annotationsCount, datasets, isLoading, t])
}
