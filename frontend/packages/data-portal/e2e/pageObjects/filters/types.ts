import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { Page } from '@playwright/test'
import { E2E_CONFIG } from 'e2e/constants'

import { QueryParams } from 'app/constants/query'

export interface TableValidatorOptions {
  client: ApolloClient<NormalizedCacheObject>
  page: Page
  pageNumber?: number
  params?: URLSearchParams
}

export type TableValidator = (options: TableValidatorOptions) => Promise<void>

// AnnotationRowCounter is a record of annotation ID to the number of times it appears in the table
export type AnnotationRowCounter = Record<string, number>

export interface MultiInputFilter {
  label: string
  queryParam: QueryParams
  valueKey: keyof typeof E2E_CONFIG
}
