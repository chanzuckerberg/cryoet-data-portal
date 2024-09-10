import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'

// This function takes an id string and returns the all numeric portions of the id.
// Inputs can be in the form of "id-123", "123", "id123", or "id-123-456"
export function extractNumericId(id: string) {
  // Use a regular expression to match the numeric portion of the ID
  const matches = id.match(/\d+/g)

  // If a match is found, return it, otherwise return null
  return matches ? matches.join('') : null
}

// TODO: as we add more prefixes, we need to update this map
export const QueryParamToIdPrefixMap: Partial<Record<QueryParams, IdPrefix>> = {
  [QueryParams.AnnotationId]: IdPrefix.Annotation,
  [QueryParams.DatasetId]: IdPrefix.Dataset,
  [QueryParams.DepositionId]: IdPrefix.Deposition,
  // Currently we cannot filter by Run or Tiltseries ID, so they are not here
}

export function getPrefixedId(queryParam: QueryParams, id: string) {
  // ID may or may not already be prefixed, so take it off just in case
  const cleanId = extractNumericId(id)
  const prefix = QueryParamToIdPrefixMap[queryParam] ?? ''
  return prefix ? `${prefix}-${cleanId}` : id
}
