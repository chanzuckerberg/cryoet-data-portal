import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

export interface PaginationFilter {
  key: string
  value: string
}

export interface TestOptions {
  pageNumber?: number
  filter?: PaginationFilter
}

export type GetMaxPages = (
  client: ApolloClient<NormalizedCacheObject>,
  filter?: PaginationFilter,
  pageNumber?: number,
) => Promise<number>
