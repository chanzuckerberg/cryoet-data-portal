import { isArray, isEmpty, isNil, isObject } from 'lodash-es'

export function removeNullishValues<T extends Record<string, unknown>>(
  value: T,
): T {
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, val]) => !isNil(val) && (!isObject(val) || !isEmpty(val)))
      .map(([key, val]) => [
        key,
        isObject(val) && !isArray(val) ? removeNullishValues(val as T) : val,
      ]),
  ) as T
}
