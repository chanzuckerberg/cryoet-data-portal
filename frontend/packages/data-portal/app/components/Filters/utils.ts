// This function takes an id string and returns the numeric portion of the id.

import { QueryParams } from 'app/constants/query'

// Inputs can be in the form of "id-123", "123", "id123", or "id-123-456"
export function extractNumericId(id: string) {
  // Use a regular expression to match the numeric portion of the ID
  const match = id.match(/\d+/)

  // If a match is found, return it, otherwise return null
  return match ? match[0] : null
}

export const QueryParamToIdPrefixMap: Partial<Record<QueryParams, string>> = {
  [QueryParams.DatasetId]: 'DS',
}

export function getPrefixedId(queryParam: QueryParams, id: string) {
  // ID may or may not already be prefixed, so take it off just in case
  const cleanId = extractNumericId(id)
  const prefix = QueryParamToIdPrefixMap[queryParam] ?? ''
  return prefix ? `${prefix}-${cleanId}` : id
}
