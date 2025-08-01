import { CellHeaderDirection } from '@czi-sds/components'

import { OrderBy } from 'app/__generated_v2__/graphql'
import { QueryParams } from 'app/constants/query'
import { DataContentsType } from 'app/types/deposition-queries'

export interface LoaderParams {
  id: number
  page: number
  sort?: CellHeaderDirection
  orderByV2?: OrderBy
  type: DataContentsType | null
}

/**
 * Validates and parses the deposition ID from URL parameters
 * @param id - The ID parameter from the URL
 * @throws Response with 400 status if ID is invalid
 * @returns Validated numeric ID
 */
export function validateDepositionId(id: string | undefined): number {
  const numericId = id ? +id : NaN

  if (Number.isNaN(numericId)) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  return numericId
}

/**
 * Parses loader parameters from the request URL
 * @param url - The request URL object
 * @param id - The validated deposition ID
 * @returns Parsed loader parameters
 */
export function parseLoaderParams(url: URL, id: number): LoaderParams {
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')
  const sort = (url.searchParams.get(QueryParams.Sort) ?? undefined) as
    | CellHeaderDirection
    | undefined

  let orderByV2: OrderBy | undefined
  if (sort) {
    orderByV2 = sort === 'asc' ? OrderBy.Asc : OrderBy.Desc
  }

  const type = url.searchParams.get(
    QueryParams.DepositionTab,
  ) as DataContentsType | null

  return {
    id,
    page,
    sort,
    orderByV2,
    type,
  }
}
