import { match, P } from 'ts-pattern'

import { TiltSeriesScore } from 'app/constants/tiltSeries'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'
import { inQualityScoreRange } from 'app/utils/tiltSeries'

const TILT_SERIES_SCORE_I18N: Record<TiltSeriesScore, string> = {
  [TiltSeriesScore.VeryPoor]: i18n.veryPoor,
  [TiltSeriesScore.Poor]: i18n.poor,
  [TiltSeriesScore.Moderate]: i18n.moderate,
  [TiltSeriesScore.Good]: i18n.good,
  [TiltSeriesScore.Excellent]: i18n.excellent,
}

export function TiltSeriesQualityScoreBadge({
  score,
}: {
  score: TiltSeriesScore | number
}) {
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
      {score} - {TILT_SERIES_SCORE_I18N[score]}
    </div>
  )
}
