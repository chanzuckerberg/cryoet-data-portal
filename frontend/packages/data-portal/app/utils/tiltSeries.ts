import { inRange } from 'lodash-es'

import { TiltSeriesScore } from 'app/constants/tiltSeries'

export function inQualityScoreRange(score: number): score is TiltSeriesScore {
  return inRange(score, TiltSeriesScore.VeryPoor, TiltSeriesScore.Excellent + 1)
}
