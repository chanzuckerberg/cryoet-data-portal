import { match, P } from 'ts-pattern'

import { TiltSeriesScore } from 'app/constants/tiltSeries'
import { useTiltScoreI18n } from 'app/hooks/useTiltScoreI18n'
import { cns } from 'app/utils/cns'
import { inQualityScoreRange } from 'app/utils/tiltSeries'

export function TiltSeriesQualityScoreBadge({
  score,
}: {
  score: TiltSeriesScore | number
}) {
  const tiltScoreI18n = useTiltScoreI18n()

  if (!inQualityScoreRange(score)) {
    return null
  }

  return (
    <div
      className={cns(
        'px-sds-xs py-sds-xxxs rounded inline-flex',

        match(score)
          .with(
            TiltSeriesScore.VeryPoor,
            () => 'bg-sds-error-200 text-sds-error-600',
          )
          .with(
            TiltSeriesScore.Poor,
            () => 'bg-sds-warning-200 text-sds-warning-600',
          )
          .with(
            P.union(
              TiltSeriesScore.Moderate,
              TiltSeriesScore.Good,
              TiltSeriesScore.Excellent,
            ),
            () => 'bg-sds-success-200 text-sds-success-600',
          )
          .otherwise(() => ''),
      )}
    >
      {score} - {tiltScoreI18n[score]}
    </div>
  )
}
