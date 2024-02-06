import { useCallback, useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'
import { SelectFilter } from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { TiltSeriesScore } from 'app/constants/tiltSeries'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { useTiltScoreI18n } from 'app/hooks/useTiltScoreI18n'
import { BaseFilterOption } from 'app/types/filter'

export function QualityScoreFilter() {
  const {
    datasets: [dataset],
  } = useTypedLoaderData<GetDatasetByIdQuery>()

  const {
    updateValue,
    tiltSeries: { qualityScore },
  } = useFilter()

  const { t } = useI18n()

  const allQualityScores = useMemo(
    () =>
      Array.from(
        new Set(
          dataset.quality_scores
            .flatMap((run) =>
              run.tiltseries.map(
                (tiltSeries) => tiltSeries.tilt_series_quality,
              ),
            )
            .concat(3, 4),
        ),
      ) as TiltSeriesScore[],
    [dataset.quality_scores],
  )

  const tiltScoreI18n = useTiltScoreI18n()
  const getScoreOption = useCallback(
    (score: TiltSeriesScore | string) =>
      ({
        label: `${score} - ${tiltScoreI18n[score as TiltSeriesScore]}`,
        value: `${score}`,
      }) as BaseFilterOption,
    [tiltScoreI18n],
  )

  const qualityScoreOptions = useMemo(
    () => allQualityScores.map<BaseFilterOption>(getScoreOption),
    [allQualityScores, getScoreOption],
  )

  const qualityScoreValue = useMemo(
    () => qualityScore.map<BaseFilterOption>(getScoreOption),
    [getScoreOption, qualityScore],
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
