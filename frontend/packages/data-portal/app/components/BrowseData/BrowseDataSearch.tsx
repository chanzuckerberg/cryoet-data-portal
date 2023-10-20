import { InputSearch } from '@czi-sds/components'
import { useDebouncedEffect } from '@react-hookz/web'
import { useSearchParams } from '@remix-run/react'
import { useState } from 'react'

import { i18n } from 'app/i18n'

const SEARCH_QUERY_DEBOUNCE_TIME_MS = 500

export function BrowseDataSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('search') ?? '')

  useDebouncedEffect(
    () =>
      setSearchParams((prev) => {
        if (query) {
          prev.set('search', query)
        } else if (prev.has('search')) {
          prev.delete('search')
        }

        return prev
      }),
    [query],
    SEARCH_QUERY_DEBOUNCE_TIME_MS,
  )

  return (
    <InputSearch
      id="data-search"
      label={i18n.search}
      sdsStyle="rounded"
      placeholder={i18n.search}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
    />
  )
}
