import { atom, useAtom } from 'jotai'
import { useMemo } from 'react'

import { DATASET_FILTERS, RUN_FILTERS } from 'app/constants/filterQueryParams'

export type BrowseDatasetHistory = Map<
  (typeof DATASET_FILTERS)[number],
  string | null
>
export type SingleDatasetHistory = Map<
  (typeof RUN_FILTERS)[number],
  string | null
>

const browseDatasetHistoryAtom = atom<BrowseDatasetHistory | null>(null)
const singleDatasetHistoryAtom = atom<SingleDatasetHistory | null>(null)

export function useBrowseDatasetFilterHistory() {
  const [browseDatasetHistory, setBrowseDatasetHistory] = useAtom(
    browseDatasetHistoryAtom,
  )

  return useMemo(
    () => ({
      browseDatasetHistory,
      setBrowseDatasetHistory,
    }),
    [browseDatasetHistory, setBrowseDatasetHistory],
  )
}

export function useSingleDatasetFilterHistory() {
  const [singleDatasetHistory, setSingleDatasetHistory] = useAtom(
    singleDatasetHistoryAtom,
  )

  return useMemo(
    () => ({
      singleDatasetHistory,
      setSingleDatasetHistory,
    }),
    [singleDatasetHistory, setSingleDatasetHistory],
  )
}
