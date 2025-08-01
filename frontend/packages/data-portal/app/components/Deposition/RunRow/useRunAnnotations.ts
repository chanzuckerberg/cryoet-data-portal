import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { useItemsForRunAndDeposition } from 'app/queries/useItemsForRunAndDeposition'
import { DataContentsType } from 'app/types/deposition-queries'

import { AnnotationRowData } from './types'
import { transformAnnotationData } from './utils'

interface UseRunAnnotationsParams {
  depositionId: number | undefined
  runId: number | undefined
  currentPage: number
  isExpanded: boolean
}

interface UseRunAnnotationsReturn {
  annotations: AnnotationRowData[]
  isLoading: boolean
  error: Error | null
  totalCount: number
  calculatedTotalPages: number
  startIndex: number
  endIndex: number
}

export function useRunAnnotations({
  depositionId,
  runId,
  currentPage,
  isExpanded,
}: UseRunAnnotationsParams): UseRunAnnotationsReturn {
  // Fetch annotations from backend when expanded
  const { data, isLoading, error } = useItemsForRunAndDeposition({
    depositionId: isExpanded ? depositionId : undefined,
    runId: isExpanded ? runId : undefined,
    type: DataContentsType.Annotations,
    page: currentPage,
  })

  // Use backend data count, show 0 if not available
  const totalCount =
    (data && 'annotationShapesAggregate' in data
      ? data.annotationShapesAggregate?.aggregate?.[0]?.count
      : undefined) ?? 0

  const pageSize = MAX_PER_FULLY_OPEN_ACCORDION
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalCount)
  const calculatedTotalPages = Math.ceil(totalCount / pageSize)

  // Transform backend data to component format
  const annotations = data ? transformAnnotationData(data, '') : []

  return {
    annotations,
    isLoading,
    error,
    totalCount,
    calculatedTotalPages,
    startIndex,
    endIndex,
  }
}
