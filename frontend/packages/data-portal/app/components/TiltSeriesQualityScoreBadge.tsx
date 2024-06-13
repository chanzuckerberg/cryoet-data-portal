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
        'px-sds-xs py-sds-xxxs text-sds-body-xxxs leading-sds-body-xxxs rounded inline-flex',

        match(score)
          .with(
            TiltSeriesScore.VeryPoor,
            () => 'bg-sds-error-400 text-sds-gray-white',
          )
          .with(
            TiltSeriesScore.Poor,
            () => 'bg-sds-warning-400 text-sds-gray-white',
          )
          .with(
            P.union(
              TiltSeriesScore.Moderate,
              TiltSeriesScore.Good,
              TiltSeriesScore.Excellent,
            ),
            () => 'bg-sds-success-400 text-sds-gray-white',
          )
          .otherwise(() => ''),
      )}
    >
      {score} - {tiltScoreI18n[score]}
    </div>
  )
}
