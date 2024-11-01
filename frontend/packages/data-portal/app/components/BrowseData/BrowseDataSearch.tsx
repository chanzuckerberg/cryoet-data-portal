import { InputSearch } from '@czi-sds/components'
import { useDebouncedEffect } from '@react-hookz/web'
import { useSearchParams } from '@remix-run/react'
import { useAtom } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { useEffect, useRef } from 'react'

import { QueryParams } from 'app/constants/query'
import { i18n } from 'app/i18n'
import { searchQueryAtom } from 'app/state/search'

/**
 * The amount of time to wait after the user has typed in a query before
 * re-fetching the list of datasets. The 500ms should be enough time for people
 * of variable typing speeds to enter a complete query.
 */
const SEARCH_QUERY_DEBOUNCE_TIME_MS = 500

export function BrowseDataSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useAtom(searchQueryAtom)

  useHydrateAtoms([
    [searchQueryAtom, searchParams.get(QueryParams.Search) ?? ''],
  ])

  // Reset when navigating away
  useEffect(() => () => setQuery(''), [setQuery])

  // If the user hasn't typed in a key for 500ms, then update the search params.
  const initialLoadRef = useRef(true)
  useDebouncedEffect(
    () => {
      // do not init search param on initial load to prevent refetch
      if (initialLoadRef.current) {
        initialLoadRef.current = false
        return
      }

      setSearchParams((prev) => {
        if (query) {
          prev.set('search', query)
        } else if (prev.has('search')) {
          prev.delete('search')
        }

        return prev
      })
    },
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
