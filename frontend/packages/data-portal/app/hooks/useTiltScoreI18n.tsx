import { useMemo } from 'react'

import { TiltSeriesScore } from 'app/constants/tiltSeries'

import { useI18n } from './useI18n'

export function useTiltScoreI18n() {
  const { t } = useI18n()

  return useMemo(
    () => ({
      [TiltSeriesScore.VeryPoor]: t('veryPoor'),
      [TiltSeriesScore.Poor]: t('poor'),
      [TiltSeriesScore.Moderate]: t('moderate'),
      [TiltSeriesScore.Good]: t('good'),
      [TiltSeriesScore.Excellent]: t('excellent'),
    }),
    [t],
  )
}
