import { PaginationFilter } from './types'

export function getParamsFromFilter(filter?: PaginationFilter) {
  return filter ? new URLSearchParams([[filter.key, filter.value]]) : undefined
}
