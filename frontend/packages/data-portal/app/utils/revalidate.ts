import { ShouldRevalidateFunctionArgs } from '@remix-run/react'

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
    !allParamsToRefetch.some(
      (param) =>
        currentUrl.searchParams.get(param) !== nextUrl.searchParams.get(param),
    )
  ) {
    return false
  }

  return defaultShouldRevalidate
}
