import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { Page } from '@playwright/test'

export interface TableValidatorOptions {
  client: ApolloClient<NormalizedCacheObject>
  page: Page
  pageNumber?: number
  params?: URLSearchParams
}

export type TableValidator = (options: TableValidatorOptions) => Promise<void>

// AnnotationRowCounter is a record of annotation ID to the number of times it appears in the table
export type AnnotationRowCounter = Record<string, number>
