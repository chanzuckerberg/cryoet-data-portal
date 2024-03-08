import { isNumber } from 'lodash-es'

import { useI18n } from './useI18n'

export function useTiltRangeLabel(
  min: number | null | undefined,
  max: number | null | undefined,
) {
  const { t } = useI18n()

  if (!isNumber(min) || !isNumber(max)) {
    return '--'
  }

  return `${t('unitDegree', {
    value: max - min,
  })} (${t('valueToValue', {
    value1: t('unitDegree', { value: min }),
    value2: t('unitDegree', { value: max }),
  })})`
}
