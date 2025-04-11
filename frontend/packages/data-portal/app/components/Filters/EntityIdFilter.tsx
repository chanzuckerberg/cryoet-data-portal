import { useMemo } from 'react'

import { QueryParams } from 'app/constants/query'
import {
  ALL_DIGITS_REGEX,
  getEntityIdPrefixRegex,
  getPrefixedId,
  QueryParamToIdPrefixMap,
  removeIdPrefix,
} from 'app/utils/idPrefixes'

import { RegexFilter } from './RegexFilter'

export function EntityIdFilter({
  id,
  label,
  title,
  queryParam,
  placeholder,
}: {
  id: string
  label: string
  title: string
  queryParam: QueryParams
  placeholder?: string
}) {
  const prefix = QueryParamToIdPrefixMap[queryParam]
  const validationRegex = useMemo(
    () => (prefix ? getEntityIdPrefixRegex(prefix) : ALL_DIGITS_REGEX),
    [prefix],
  )

  return (
    <RegexFilter
      id={id}
      label={label}
      title={title}
      queryParam={queryParam}
      regex={validationRegex}
      placeholder={placeholder}
      displayNormalizer={(value) => getPrefixedId(value, queryParam)}
      paramNormalizer={(value) => removeIdPrefix(value, queryParam) ?? ''}
    />
  )
}
