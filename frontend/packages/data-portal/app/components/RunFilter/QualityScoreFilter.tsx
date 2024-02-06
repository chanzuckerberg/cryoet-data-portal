import { useCallback, useMemo } from 'react'

import { SelectFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { TiltSeriesScore } from 'app/constants/tiltSeries'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { useTiltScoreI18n } from 'app/hooks/useTiltScoreI18n'
import { BaseFilterOption } from 'app/types/filter'

export function QualityScoreFilter() {
  const { dataset } = useDatasetById()

  const {
    updateValue,
    tiltSeries: { qualityScore },
  } = useFilter()

  const { t } = useI18n()

  const allQualityScores = useMemo(
    () =>
      Array.from(
        new Set(
          dataset.run_stats
            .flatMap((run) =>
              run.tiltseries.map(
                (tiltSeries) => tiltSeries.tilt_series_quality,
              ),
            )
            .concat(3, 4),
        ),
      ) as TiltSeriesScore[],
    [dataset.run_stats],
  )

  const tiltScoreI18n = useTiltScoreI18n()
  const getScoreOptions = useCallback(
    (scores: Array<TiltSeriesScore | string>) =>
      scores.map(
        (score) =>
          ({
            label: `${score} - ${tiltScoreI18n[score as TiltSeriesScore]}`,
            value: `${score}`,
          }) as BaseFilterOption,
      ),
    [tiltScoreI18n],
  )

  const qualityScoreOptions = useMemo(
    () => getScoreOptions(allQualityScores),
    [allQualityScores, getScoreOptions],
  )

  const qualityScoreValue = useMemo(
    () => getScoreOptions(qualityScore),
    [getScoreOptions, qualityScore],
  )

  return (
    <SelectFilter
      multiple
      label={t('tiltSeriesQualityScore')}
      onChange={(options) => updateValue(QueryParams.QualityScore, options)}
      options={qualityScoreOptions}
      value={qualityScoreValue}
    />
  )
}
