import { inRange } from 'lodash-es'

import { TiltSeriesScore } from 'app/constants/tiltSeries'
import type { I18nTFunction } from 'app/hooks/useI18n'

export function inQualityScoreRange(score: number): score is TiltSeriesScore {
  return inRange(score, TiltSeriesScore.VeryPoor, TiltSeriesScore.Excellent + 1)
}

export function getTiltRangeLabel(t: I18nTFunction, min: number, max: number) {
  return `${t('unitDegree', {
    value: max - min,
  })} (${t('valueToValue', {
    value1: t('unitDegree', { value: min }),
    value2: t('unitDegree', { value: max }),
  })})`
}
