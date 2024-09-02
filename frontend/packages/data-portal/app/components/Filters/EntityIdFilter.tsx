import { useMemo } from 'react'

import { IdPrefix } from 'app/constants/idPrefixes'
import { QueryParams } from 'app/constants/query'

import { RegexFilter } from './RegexFilter'

export function EntityIdFilter({
  id,
  label,
  title,
  queryParam,
  prefix,
}: {
  id: string
  label: string
  title: string
  queryParam: QueryParams
  prefix?: IdPrefix
}) {
  const validationRegex = useMemo(
    () => (prefix ? RegExp(`^(${prefix}-)?\\d+$`, 'i') : /^\d+$/),
    [prefix],
  )

  return (
    <RegexFilter
      id={id}
      label={label}
      title={title}
      queryParam={queryParam}
      regex={validationRegex}
      displayNormalizer={(value) =>
        prefix && value.startsWith(prefix) ? value : `${prefix}-${value}`
      }
      paramNormalizer={(value) =>
        value.replace(new RegExp(`^${prefix}-`, 'i'), '')
      }
    />
  )
}
