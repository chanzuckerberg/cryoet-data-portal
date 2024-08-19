import { atom, useAtom } from 'jotai'

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
const previousDepositionIdAtom = atom<number | null>(null)

export function useBrowseDatasetFilterHistory() {
  const [browseDatasetHistory, setBrowseDatasetHistory] = useAtom(
    browseDatasetHistoryAtom,
  )

  return {
    browseDatasetHistory,
    setBrowseDatasetHistory,
  }
}

export function useSingleDatasetFilterHistory() {
  const [singleDatasetHistory, setSingleDatasetHistory] = useAtom(
    singleDatasetHistoryAtom,
  )

  return {
    singleDatasetHistory,
    setSingleDatasetHistory,
  }
}

export function useDepositionHistory() {
  const [previousDepositionId, setPreviousDepositionId] = useAtom(
    previousDepositionIdAtom,
  )

  return {
    previousDepositionId,
    setPreviousDepositionId,
  }
}
