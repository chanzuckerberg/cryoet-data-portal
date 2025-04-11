import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { isEqual } from 'lodash-es'

import { QueryParams } from 'app/constants/query'

const PARAMS_TO_REFETCH = [QueryParams.Page]

export function shouldRevalidatePage({
  formMethod = 'GET',
  currentParams,
  nextParams,
  defaultShouldRevalidate,
  currentUrl,
  nextUrl,
  paramsToRefetch = [],
}: ShouldRevalidateFunctionArgs & {
  paramsToRefetch?: QueryParams[]
}) {
  const allParamsToRefetch = PARAMS_TO_REFETCH.concat(paramsToRefetch)

  if (
    formMethod === 'GET' &&
    currentParams.id === nextParams.id &&
    !allParamsToRefetch.some((param) => {
      const currentValues = currentUrl.searchParams.getAll(param).sort()
      const nextValues = nextUrl.searchParams.getAll(param).sort()
      return !isEqual(currentValues, nextValues)
    })
  ) {
    return false
  }

  return defaultShouldRevalidate
}
