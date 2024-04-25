import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

import { DATASET_FILTERS, RUN_FILTERS } from 'app/constants/filterQueryParams'

export type BrowseAllHistory = Map<
  (typeof DATASET_FILTERS)[number],
  string | null
>
export type SingleDatasetHistory = Map<
  (typeof RUN_FILTERS)[number],
  string | null
>

const browseAllHistoryAtom = atom<BrowseAllHistory | null>(null)
const singleDatasetHistoryAtom = atom<SingleDatasetHistory | null>(null)

export function useFilterHistory() {
  const [browseAllHistory, setBrowseAllHistory] = useAtom(browseAllHistoryAtom)
  const [singleDatasetHistory, setSingleDatasetHistory] = useAtom(
    singleDatasetHistoryAtom,
  )

  return useMemo(
    () => ({
      browseAllHistory,
      setBrowseAllHistory,
      singleDatasetHistory,
      setSingleDatasetHistory,
    }),
    [
      browseAllHistory,
      setBrowseAllHistory,
      singleDatasetHistory,
      setSingleDatasetHistory,
    ],
  )
}
