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
  const { tiltseriesQualityScores } = useDatasetById()

  const {
    updateValue,
    tiltSeries: { qualityScore },
  } = useFilter()

  const { t } = useI18n()

  const tiltScoreI18n = useTiltScoreI18n()
  const getScoreOptions = useCallback(
    (scores: Array<TiltSeriesScore | string>) =>
      scores
        .map(
          (score) =>
            ({
              label: `${score} - ${tiltScoreI18n[score as TiltSeriesScore]}`,
              value: `${score}`,
            }) as BaseFilterOption,
        )
        .sort((a, b) => (b.label ?? '').localeCompare(a.label ?? '')),
    [tiltScoreI18n],
  )

  const qualityScoreOptions = useMemo(
    () => getScoreOptions(tiltseriesQualityScores),
    [tiltseriesQualityScores, getScoreOptions],
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
