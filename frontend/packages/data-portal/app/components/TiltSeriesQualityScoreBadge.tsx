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
        'px-sds-xs py-sds-xxxs text-sds-body-xxxs-400-wide leading-sds-body-xxxs rounded inline-flex',

        match(score)
          .with(
            TiltSeriesScore.VeryPoor,
            () =>
              'bg-light-sds-color-primitive-red-400 text-light-sds-color-primitive-gray-50',
          )
          .with(
            TiltSeriesScore.Poor,
            () =>
              'bg-light-sds-color-primitive-yellow-400 text-light-sds-color-primitive-gray-50',
          )
          .with(
            P.union(
              TiltSeriesScore.Moderate,
              TiltSeriesScore.Good,
              TiltSeriesScore.Excellent,
            ),
            () =>
              'bg-light-sds-color-primitive-green-400 text-light-sds-color-primitive-gray-50',
          )
          .otherwise(() => ''),
      )}
    >
      {score} - {tiltScoreI18n[score]}
    </div>
  )
}
