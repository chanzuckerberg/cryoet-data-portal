import { Table as SDSTable, TableHeader } from '@czi-sds/components'
import TableContainer from '@mui/material/TableContainer'
import { useMemo } from 'react'

import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import { useI18n } from 'app/hooks/useI18n'
import { useDepositionRunsForDataset } from 'app/queries/useDepositionRunsForDataset'
import { RunData } from 'app/types/deposition'
import { DataContentsType } from 'app/types/deposition-queries'

import { SkeletonRow } from './SkeletonRow'

// Base interfaces for the generic LocationTable
export interface BaseLocationTableProps {
  runPagination: Record<string, Record<string, number>>
  expandedRuns: Record<string, Record<string, boolean>>
  onRunToggle: (location: string, runName: string) => void
  onRunPageChange: (location: string, runName: string, newPage: number) => void
  depositionId: number
  datasetId: number
  datasetTitle: string
  isExpanded: boolean
  currentGroupPage?: number
}

// Configuration interface for table specialization
export interface LocationTableConfig<TRowData> {
  dataContentType: DataContentsType
  tableHeaders: React.ReactNode
  renderRow: (props: RowRenderProps<TRowData>) => React.ReactNode
  skeletonColSpan: number
}

// Props passed to renderRow function
export interface RowRenderProps<TRowData> {
  run: RunData<TRowData>
  depositionId: number
  isExpanded: boolean
  onToggle: () => void
  currentPage: number
  onPageChange: (page: number) => void
  location: string
}

// Main LocationTable props
interface LocationTableProps<TRowData> extends BaseLocationTableProps {
  config: LocationTableConfig<TRowData>
}

export function LocationTable<TRowData>({
  runPagination,
  expandedRuns,
  onRunToggle,
  onRunPageChange,
  depositionId,
  datasetId,
  datasetTitle,
  isExpanded,
  currentGroupPage,
  config,
}: LocationTableProps<TRowData>) {
  const { t } = useI18n()
  const { dataContentType, tableHeaders, renderRow, skeletonColSpan } = config

  // Fetch backend data when expanded
  const { data, isLoading, error } = useDepositionRunsForDataset({
    depositionId: isExpanded ? depositionId : undefined,
    datasetId: isExpanded ? datasetId : undefined,
    type: dataContentType,
    page: currentGroupPage || 1,
  })

  // Process data based on content type
  const locationData = useMemo(() => {
    if (!data) {
      return { depositedLocation: datasetTitle, runs: [] }
    }

    // Handle annotation-specific aggregation
    if (dataContentType === DataContentsType.Annotations) {
      const annotationShapesCountByRunId = new Map<number, number>()
      if ('annotationShapesAggregate' in data) {
        data.annotationShapesAggregate.aggregate?.forEach((agg) => {
          const runId = agg.groupBy?.annotation?.run?.id
          if (runId !== null && runId !== undefined) {
            annotationShapesCountByRunId.set(runId, agg.count ?? 0)
          }
        })
      }

      return {
        depositedLocation: datasetTitle,
        runs: data.runs.map((run) => ({
          id: run.id,
          runName: run.name ?? '--',
          items: [] as TRowData[],
          annotationCount: annotationShapesCountByRunId.get(run.id) ?? 0,
        })),
      }
    }

    // Handle tomogram data
    return {
      depositedLocation: datasetTitle,
      runs: data.runs.map((run) => ({
        id: run.id,
        runName: run.name ?? '--',
        items: [] as TRowData[],
        tomogramCount:
          'tomogramsAggregate' in run
            ? run.tomogramsAggregate?.aggregate?.[0]?.count ?? 0
            : 0,
      })),
    }
  }, [data, datasetTitle, dataContentType])

  const { depositedLocation } = locationData

  // Show loading state
  if (isExpanded && isLoading) {
    return (
      <TableContainer className="!px-0">
        <SDSTable className="!table-fixed [&>thead]:border-none">
          <TableHeader>{tableHeaders}</TableHeader>
          <tbody>
            {Array.from({ length: MAX_PER_ACCORDION_GROUP }, (_, index) => (
              <SkeletonRow
                key={`skeleton-${index}`}
                colSpan={skeletonColSpan}
              />
            ))}
          </tbody>
        </SDSTable>
      </TableContainer>
    )
  }

  // Show error state
  if (isExpanded && error) {
    return (
      <div className="p-4 text-center text-red-600">
        {t('errorLoadingRuns')}
      </div>
    )
  }

  // Render table with data
  return (
    <TableContainer className="!px-0">
      <SDSTable className="!table-fixed [&>thead]:border-none">
        <TableHeader>{tableHeaders}</TableHeader>
        <tbody>
          {locationData.runs.map((run) => {
            const isRunExpanded =
              expandedRuns[depositedLocation]?.[run.runName] || false
            const runCurrentPage =
              runPagination[depositedLocation]?.[run.runName] || 1

            return renderRow({
              run,
              depositionId,
              isExpanded: isRunExpanded,
              onToggle: () => onRunToggle(depositedLocation, run.runName),
              currentPage: runCurrentPage,
              onPageChange: (newPage: number) =>
                onRunPageChange(depositedLocation, run.runName, newPage),
              location: depositedLocation,
            })
          })}
        </tbody>
      </SDSTable>
    </TableContainer>
  )
}
