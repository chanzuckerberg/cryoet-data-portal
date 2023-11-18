/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { DeepNonNullable } from 'utility-types'

function convertToPlainObject<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  const result: Record<string, unknown> = {}

  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const value = obj[key as keyof T]

      if (value !== null && typeof value === 'object') {
        if (Array.isArray(value)) {
          result[key] = value.map((item) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            typeof item === 'object' ? convertToPlainObject(item) : item,
          )
        } else {
          result[key] = convertToPlainObject(value as T)
        }
      } else if (value !== undefined) {
        result[key] = value
      }
    }
  }

  return result as Partial<T>
}

export function getSelfCreatingObject<T>(): DeepNonNullable<T> {
  return new Proxy(
    {},
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get(target: Record<string, unknown>, prop: any) {
        if (prop === 'toJSON') {
          return convertToPlainObject(target)
        }

        if (!(prop in target)) {
          // Create an empty object if the property doesn't exist
          // eslint-disable-next-line no-param-reassign
          target[prop] = getSelfCreatingObject()
        }

        return target[prop]
      },
    },
  ) as DeepNonNullable<T>
}
