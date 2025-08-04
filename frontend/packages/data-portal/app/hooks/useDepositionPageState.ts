import { useEffect } from 'react'

import { DEPOSITION_FILTERS } from 'app/constants/filterQueryParams'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useDepositionGroupedData } from 'app/hooks/useDepositionGroupedData'
import {
  useDepositionHistory,
  useSyncParamsWithState,
} from 'app/state/filterHistory'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { useDatasetsFilterData } from './useDatasetsFilterData'

export interface DepositionPageState {
  // Core data
  deposition: ReturnType<typeof useDepositionById>['deposition']
  annotationsCount: number
  tomogramsCount: number
  filteredAnnotationsCount: number
  filteredTomogramsCount: number
  filteredDatasetsCount: number
  totalDatasetsCount: number

  // Grouped data
  groupedData: {
    organisms: Array<{ name: string }>
    datasets: Array<{
      id: number
      title: string
      organismName: string | null
      runCount: number
      annotationCount: number
      tomogramRunCount: number
    }>
    counts: {
      organisms: Record<string, number>
      tomograms: Record<number, number>
    }
    totalDatasetCount: number
    filteredDatasetCount: number
    totalOrganismCount: number
    filteredOrganismCount: number
    isLoading: boolean
  }
}

/**
 * Consolidated hook for all deposition page state management
 * @returns Combined state object with all deposition page data and UI state
 */
export function useDepositionPageState(): DepositionPageState {
  const {
    deposition,
    annotationsCount,
    tomogramsCount,
    filteredAnnotationsCount,
    filteredTomogramsCount,
  } = useDepositionById()
  const { filteredDatasetsCount, totalDatasetsCount } = useDatasetsFilterData()

  const { setPreviousDepositionId, setPreviousSingleDepositionParams } =
    useDepositionHistory()

  useEffect(
    () => setPreviousDepositionId(deposition.id),
    [deposition.id, setPreviousDepositionId],
  )

  useSyncParamsWithState({
    filters: DEPOSITION_FILTERS,
    setParams: setPreviousSingleDepositionParams,
  })

  const isExpandDepositions = useFeatureFlag('expandDepositions')
  const groupedData = useDepositionGroupedData({
    enabled: isExpandDepositions,
  })

  return {
    // Core data
    deposition,
    annotationsCount,
    tomogramsCount,
    filteredAnnotationsCount,
    filteredTomogramsCount,
    filteredDatasetsCount,
    totalDatasetsCount,

    // Grouped data
    groupedData,
  }
}
