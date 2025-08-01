import { Fragment } from 'react'

import { RunAnnotationsList } from './RunAnnotationsList'
import { RunRowHeader } from './RunRowHeader'
import { RunRowProps } from './types'
import { useRunAnnotations } from './useRunAnnotations'

export function RunRow({
  run,
  depositionId,
  annotationCount,
  isExpanded,
  onToggle,
  currentPage,
  onPageChange,
}: RunRowProps) {
  const {
    annotations,
    isLoading,
    error,
    totalCount,
    calculatedTotalPages,
    startIndex,
    endIndex,
  } = useRunAnnotations({
    depositionId,
    runId: run.id,
    currentPage,
    isExpanded,
  })

  // Use fallback count if backend doesn't provide data
  const displayCount = totalCount || annotationCount || 0

  return (
    <Fragment key={run.runName}>
      <RunRowHeader
        runName={run.runName}
        isExpanded={isExpanded}
        onToggle={onToggle}
        totalCount={displayCount}
        currentPage={currentPage}
        totalPages={calculatedTotalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      {isExpanded && (
        <RunAnnotationsList
          isLoading={isLoading}
          error={error}
          annotations={annotations}
          runName={run.runName}
          totalCount={displayCount}
        />
      )}
    </Fragment>
  )
}
