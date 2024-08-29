import { useSearchParams } from '@remix-run/react'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

import { DATASET_FILTERS, RUN_FILTERS } from 'app/constants/filterQueryParams'
import { QueryParams } from 'app/constants/query'

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
const previousSingleDepositionParamsAtom = atom('')

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

  const [previousSingleDepositionParams, setPreviousSingleDepositionParams] =
    useAtom(previousSingleDepositionParamsAtom)

  return {
    previousDepositionId,
    setPreviousDepositionId,
    previousSingleDepositionParams,
    setPreviousSingleDepositionParams,
  }
}

export function useSyncParamsWithState({
  filters,
  setHistory,
}: {
  filters: readonly QueryParams[]
  setHistory(params: string): void
}) {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)

    for (const key of newParams.keys()) {
      if (!filters.includes(key as QueryParams)) {
        newParams.delete(key)
      }
    }

    newParams.sort()

    setHistory(newParams.toString())
  }, [filters, searchParams, setHistory])
}
