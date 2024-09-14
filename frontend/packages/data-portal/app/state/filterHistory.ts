import { useSearchParams } from '@remix-run/react'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

import { QueryParams } from 'app/constants/query'

const previousBrowseDatasetParamsAtom = atom('')
const previousSingleDatasetParamsAtom = atom('')
const previousDepositionIdAtom = atom<number | null>(null)
const previousSingleDepositionParamsAtom = atom('')

export function useBrowseDatasetFilterHistory() {
  const [previousBrowseDatasetParams, setPreviousBrowseDatasetParams] = useAtom(
    previousBrowseDatasetParamsAtom,
  )

  return {
    previousBrowseDatasetParams,
    setPreviousBrowseDatasetParams,
  }
}

export function useSingleDatasetFilterHistory() {
  const [previousSingleDatasetParams, setPreviousSingleDatasetParams] = useAtom(
    previousSingleDatasetParamsAtom,
  )

  return {
    previousSingleDatasetParams,
    setPreviousSingleDatasetParams,
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
  setParams: setHistory,
}: {
  filters: readonly QueryParams[]
  setParams(params: string): void
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
