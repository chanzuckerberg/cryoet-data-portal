import { useSearchParams } from '@remix-run/react'
import { isFunction } from 'lodash-es'
import { useCallback, useMemo } from 'react'

import { QueryParams } from 'app/constants/query'

type QueryParamStateSetter<T> = (
  value: T | null | ((prev: T | null) => T | null),
  replace?: boolean,
) => void

function defaultSerialize(value: unknown) {
  return String(value)
}

function defaultDeserialize<T>(value: string | null) {
  return value as T | null
}

interface SerializationOptions<T> {
  deserialize?: (value: string | null) => T | null
  serialize?: (value: unknown) => string
}

export function useQueryParam<T>(
  queryParam: QueryParams,
  {
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
  }: SerializationOptions<T> = {},
): [T | null, QueryParamStateSetter<T>] {
  const [searchParams, setSearchParams] = useSearchParams()

  const value = useMemo(
    () => deserialize(searchParams.get(queryParam)),
    [deserialize, queryParam, searchParams],
  )

  const setValue = useCallback<QueryParamStateSetter<T>>(
    (nextValue, replace = false) =>
      setSearchParams(
        (prev) => {
          const prevValue = prev.get(queryParam)
          prev.delete(queryParam)

          if (nextValue) {
            prev.set(
              queryParam,
              serialize(
                isFunction(nextValue)
                  ? nextValue(prevValue as T | null)
                  : nextValue,
              ),
            )
          }

          return prev
        },
        { replace },
      ),
    [queryParam, serialize, setSearchParams],
  )

  return [value, setValue]
}

export const stringParam = <T extends string = string>() => '' as T

type UseQueryParams<T> = {
  [K in keyof T]: T[K] extends () => unknown ? ReturnType<T[K]> : T[K]
}

type Nullish<T> = {
  [K in keyof T]?: T[K] | null
}

export function useQueryParams<T>(
  queryParams: UseQueryParams<T>,
  {
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
  }: SerializationOptions<T> = {},
): [T, QueryParamStateSetter<Nullish<T>>] {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParamKeys = Object.keys(queryParams)

  const value = Object.fromEntries(
    queryParamKeys.map((param) => [
      param,
      deserialize(searchParams.get(param)),
    ]),
  ) as T

  const setValue = useCallback<QueryParamStateSetter<Nullish<T>>>(
    (nextValue) =>
      setSearchParams((prev) => {
        if (nextValue === null) {
          queryParamKeys.forEach((key) => prev.delete(key))
          return prev
        }

        const prevValue =
          queryParamKeys.length === 0
            ? null
            : (Object.fromEntries(
                queryParamKeys.map((key) => [key, prev.get(key)]),
              ) as T)

        const val = isFunction(nextValue) ? nextValue(prevValue) : nextValue
        if (val) {
          Object.entries(val).forEach(([paramKey, paramValue]) => {
            if (paramValue) {
              prev.set(paramKey, serialize(paramValue))
            } else {
              prev.delete(paramKey)
            }
          })
        }

        return prev
      }),
    [queryParamKeys, serialize, setSearchParams],
  )

  return [value, setValue]
}
