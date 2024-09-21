import {
  GO_PREFIX,
  UNIPROTKB_PREFIX,
} from 'app/constants/annotationObjectIdLinks'
import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'

// TODO: as we add more prefixes, we need to update this map
export const QueryParamToIdPrefixMap: Partial<Record<QueryParams, IdPrefix>> = {
  [QueryParams.AnnotationId]: IdPrefix.Annotation,
  [QueryParams.DatasetId]: IdPrefix.Dataset,
  [QueryParams.DepositionId]: IdPrefix.Deposition,
  // Currently we cannot filter by Run or Tiltseries ID, so they are not here
}

// This function takes a value string and returns the all non-prefix portions.
// Inputs can be in the form of "id-123", "123", "id123", or "id-123-456"
// Inputs can also be strings like "Author Name"
// NOTE: If we need prefixes for string values, like "PREFIX-Author Name", we will need to update this function
export function removeIdPrefix(value: string, queryParam?: QueryParams) {
  if (!queryParam) return value
  const prefix = QueryParamToIdPrefixMap[queryParam]
  if (!prefix) return value

  // Use a regular expression to match the numeric portion of the ID
  const matches = value.match(/\d+/g)

  // If a match is found, return it, otherwise return null
  return matches ? matches.join('') : null
}

export function getPrefixedId(id: string, queryParam?: QueryParams) {
  if (!queryParam) return id
  // ID may or may not already be prefixed, so take it off just in case
  const cleanId = removeIdPrefix(id, queryParam)
  const prefix = QueryParamToIdPrefixMap[queryParam] ?? ''
  return prefix ? `${prefix}-${cleanId}` : id
}

export const getEntityIdPrefixRegex = (prefix: string) =>
  RegExp(`^(${prefix})?(-)?\\d+$`, 'i')

export const ALL_DIGITS_REGEX = /^\d+$/
export const OBJECT_ID_REGEX = RegExp(
  `^(?:${GO_PREFIX}|${UNIPROTKB_PREFIX}).+$`,
)

export function isFilterPrefixValid(value: string, queryParam?: QueryParams) {
  if (!queryParam || value === '') return true
  const prefix = QueryParamToIdPrefixMap[queryParam]
  if (!prefix) return true

  const validationRegex = prefix ? getEntityIdPrefixRegex(prefix) : /^\d+$/
  return validationRegex.test(value)
}
