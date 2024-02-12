import { isNumber } from 'lodash-es'

import { Runs_Bool_Exp } from 'app/__generated__/graphql'
import {
  DEFAULT_TILT_RANGE_MAX,
  DEFAULT_TILT_RANGE_MIN,
} from 'app/constants/tiltSeries'

export function getTiltValue(value: string | null) {
  if (value && !Number.isNaN(+value)) {
    return +value
  }

  return null
}

export function getTiltRangeFilter(
  initialTiltMin: string,
  initialTiltMax: string,
) {
  let tiltMin = getTiltValue(initialTiltMin)
  let tiltMax = getTiltValue(initialTiltMax)

  if (isNumber(tiltMin) && !isNumber(tiltMax)) {
    tiltMax = DEFAULT_TILT_RANGE_MAX
  }

  if (!isNumber(tiltMin) && isNumber(tiltMax)) {
    tiltMin = DEFAULT_TILT_RANGE_MIN
  }

  // Tilt range filter
  if (initialTiltMin || initialTiltMax) {
    return {
      tiltseries: {
        tilt_range: {
          ...(tiltMin && { _gte: tiltMin }),
          ...(tiltMax && { _lte: tiltMax }),
        },
      },
    } as Runs_Bool_Exp
  }

  return null
}
