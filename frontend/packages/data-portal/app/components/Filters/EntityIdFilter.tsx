import { useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import {
  allDigitsRegex,
  extractNumericId,
  getEntityIdPrefixRegex,
  getPrefixedId,
  QueryParamToIdPrefixMap,
} from 'app/utils/idPrefixes'

import { RegexFilter } from './RegexFilter'

export function EntityIdFilter({
  id,
  label,
  title,
  queryParam,
}: {
  id: string
  label: string
  title: string
  queryParam: QueryParams
}) {
  const prefix = QueryParamToIdPrefixMap[queryParam]
  const validationRegex = useMemo(
    () => (prefix ? getEntityIdPrefixRegex(prefix) : allDigitsRegex),
    [prefix],
  )

  return (
    <RegexFilter
      id={id}
      label={label}
      title={title}
      queryParam={queryParam}
      regex={validationRegex}
      displayNormalizer={(value) => getPrefixedId(queryParam, value)}
      paramNormalizer={(value) => extractNumericId(value) ?? ''}
    />
  )
}
