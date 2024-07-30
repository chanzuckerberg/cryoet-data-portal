import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { Page } from '@playwright/test'

import { QueryParams } from 'app/constants/query'

export interface TableValidatorOptions {
  client: ApolloClient<NormalizedCacheObject>
  page: Page
  pageNumber?: number
  params?: URLSearchParams
}

export type TableValidator = (options: TableValidatorOptions) => Promise<void>

// RowCounterType is a record of annotation ID to the number of times it appears in the table
export type RowCounterType = Record<string, number>

export type MultiInputFilterType = {
  label: string
  value: string
}

export type QueryParamObjectType = {
  queryParamKey?: QueryParams
  queryParamValue: string
}
