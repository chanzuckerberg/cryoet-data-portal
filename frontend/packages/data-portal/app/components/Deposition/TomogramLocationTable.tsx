import {
  CellComponent,
  Table as SDSTable,
  TableHeader,
  TableRow,
} from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import TableContainer from '@mui/material/TableContainer'

import { CellHeader } from 'app/components/Table'
import { MAX_PER_ACCORDION_GROUP } from 'app/constants/pagination'
import { DepositionTomogramTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { useDepositionTomoRunsForDataset } from 'app/queries/useDepositionTomoRunsForDataset'
import { cns } from 'app/utils/cns'

import { TomogramRow } from './TomogramRow'

// Skeleton component for run loading state
function SkeletonTomogramRunRow() {
  return (
    <TableRow
      className={cns(
        '!bg-light-sds-color-semantic-base-background-secondary',
        'last:border-none',
      )}
    >
      <CellComponent colSpan={7} className="!p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sds-xs">
            <Skeleton variant="text" width={16} height={16} />
            <Skeleton variant="text" width={120} height={20} />
          </div>
          <div className="flex justify-end">
            <Skeleton variant="text" width={80} height={16} />
          </div>
        </div>
      </CellComponent>
    </TableRow>
  )
}

interface TomogramLocationTableProps {
  runPagination: Record<string, Record<string, number>>
  expandedRuns: Record<string, Record<string, boolean>>
  onRunToggle: (location: string, runName: string) => void
  onRunPageChange: (location: string, runName: string, newPage: number) => void
  currentGroupPage?: number // Page from GroupedAccordion for runs pagination
  // New props for backend integration
  depositionId: number
  datasetId: number
  datasetTitle: string
  isExpanded: boolean
}

export function TomogramLocationTable({
  runPagination,
  expandedRuns,
  onRunToggle,
  onRunPageChange,
  currentGroupPage,
  depositionId,
  datasetId,
  datasetTitle,
  isExpanded,
}: TomogramLocationTableProps) {
  const { t } = useI18n()

  // Use the hook to fetch backend data when expanded
  const { data, isLoading, error } = useDepositionTomoRunsForDataset({
    depositionId: isExpanded ? depositionId : undefined,
    datasetId: isExpanded ? datasetId : undefined,
    page: currentGroupPage || 1,
  })

  // Always use backend data, show empty state when no data available
  const locationData = data
    ? {
        depositedLocation: datasetTitle,
        runs: data.runs.map((run) => ({
          id: run.id,
          runName: run.name ?? '--',
          items: [], // Empty for unexpanded case
          tomogramCount: run.tomogramsAggregate?.aggregate?.[0]?.count ?? 0,
        })),
      }
    : { depositedLocation: datasetTitle, runs: [] }

  const { depositedLocation } = locationData

  // Show loading state while fetching backend data
  if (isExpanded && isLoading) {
    return (
      <TableContainer className="!px-0">
        <SDSTable className="!table-fixed [&>thead]:border-none">
          <TableHeader>
            <CellHeader style={DepositionTomogramTableWidths.photo}>
              {' '}
            </CellHeader>
            <CellHeader style={DepositionTomogramTableWidths.name}>
              {t('tomogramName')}
            </CellHeader>
            <CellHeader style={DepositionTomogramTableWidths.voxelSpacing}>
              {t('voxelSpacing')}
            </CellHeader>
            <CellHeader
              style={DepositionTomogramTableWidths.reconstructionMethod}
              className="overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {t('reconstructionMethod')}
            </CellHeader>
            <CellHeader style={DepositionTomogramTableWidths.postProcessing}>
              {t('postProcessing')}
            </CellHeader>
            <CellHeader style={DepositionTomogramTableWidths.depositedIn}>
              {t('depositedIn')}
            </CellHeader>
            <CellHeader style={DepositionTomogramTableWidths.actions}>
              {' '}
            </CellHeader>
          </TableHeader>
          <tbody>
            {Array.from({ length: MAX_PER_ACCORDION_GROUP }, (_, index) => (
              <SkeletonTomogramRunRow key={`run-skeleton-${index}`} />
            ))}
          </tbody>
        </SDSTable>
      </TableContainer>
    )
  }

  // Show error state if backend fetch failed
  if (isExpanded && error) {
    return (
      <div className="p-4 text-center text-red-600">Error loading runs</div>
    )
  }

  return (
    <TableContainer className="!px-0">
      <SDSTable className="!table-fixed">
        <TableHeader>
          <CellHeader style={DepositionTomogramTableWidths.photo}> </CellHeader>
          <CellHeader style={DepositionTomogramTableWidths.name}>
            {t('tomogramName')}
          </CellHeader>
          <CellHeader style={DepositionTomogramTableWidths.voxelSpacing}>
            {t('voxelSpacing')}
          </CellHeader>
          <CellHeader
            style={DepositionTomogramTableWidths.reconstructionMethod}
            className="overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {t('reconstructionMethod')}
          </CellHeader>
          <CellHeader style={DepositionTomogramTableWidths.postProcessing}>
            {t('postProcessing')}
          </CellHeader>
          <CellHeader style={DepositionTomogramTableWidths.depositedIn}>
            {t('depositedIn')}
          </CellHeader>
          <CellHeader style={DepositionTomogramTableWidths.actions}>
            {' '}
          </CellHeader>
        </TableHeader>
        <tbody>
          {locationData.runs.map((run) => {
            const isRunExpanded =
              expandedRuns[depositedLocation]?.[run.runName] || false

            // Calculate pagination variables for this run
            const runCurrentPage =
              runPagination[depositedLocation]?.[run.runName] || 1

            return (
              <TomogramRow
                key={run.runName}
                run={run}
                depositionId={depositionId}
                isExpanded={isRunExpanded}
                onToggle={() => onRunToggle(depositedLocation, run.runName)}
                currentPage={runCurrentPage}
                onPageChange={(newPage) =>
                  onRunPageChange(depositedLocation, run.runName, newPage)
                }
              />
            )
          })}
        </tbody>
      </SDSTable>
    </TableContainer>
  )
}
