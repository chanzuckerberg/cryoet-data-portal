import { Table as SDSTable, TableHeader } from '@czi-sds/components'
import TableContainer from '@mui/material/TableContainer'

import { CellHeader } from 'app/components/Table'
import { useI18n } from 'app/hooks/useI18n'
import { useDepositionAnnoRunsForDataset } from 'app/queries/useDepositionAnnoRunsForDataset'
import { transformBackendRunsToComponentFormat } from 'app/utils/deposition'

import {
  DepositedLocationData,
  paginateRunData,
} from './mockDepositedLocationData'
import { RunRow } from './RunRow'

// Extended annotation data with expandable details and mock fields
interface AnnotationRowData {
  id: number
  annotationName: string
  shapeType: string
  methodType: string
  depositedIn: string
  depositedLocation: string
  runName: string
  // Additional fields for expanded view
  objectName?: string
  confidence?: number
  description?: string
  fileFormat?: string
  s3Path?: string
  groundTruthStatus?: boolean
}

interface LocationTableProps {
  locationData: DepositedLocationData<AnnotationRowData>
  pagination: Record<string, number>
  runPagination: Record<string, Record<string, number>>
  expandedRuns: Record<string, Record<string, boolean>>
  onRunToggle: (location: string, runName: string) => void
  onRunPageChange: (location: string, runName: string, newPage: number) => void
  // New props for backend integration
  depositionId: number
  datasetId: number
  datasetTitle: string
  isExpanded: boolean
  currentGroupPage?: number // Page from GroupedAccordion for runs pagination
}

export function LocationTable({
  locationData,
  pagination,
  runPagination,
  expandedRuns,
  onRunToggle,
  onRunPageChange,
  depositionId,
  datasetId,
  datasetTitle,
  isExpanded,
  currentGroupPage,
}: LocationTableProps) {
  const { t } = useI18n()

  // Use the hook to fetch backend data when expanded
  const {
    data: backendData,
    isLoading,
    error,
  } = useDepositionAnnoRunsForDataset({
    depositionId: isExpanded ? depositionId : undefined,
    datasetId: isExpanded ? datasetId : undefined,
    page: currentGroupPage || pagination[datasetTitle] || 1,
  })

  // Determine which data to use - backend data if available, otherwise fallback to locationData
  const dataToUse = backendData?.runs
    ? transformBackendRunsToComponentFormat(backendData.runs, datasetTitle)
    : locationData

  const { depositedLocation } = dataToUse

  // Show loading state while fetching backend data
  if (isExpanded && isLoading) {
    return <div className="p-4 text-center">Loading runs...</div>
  }

  // Show error state if backend fetch failed
  if (isExpanded && error) {
    return (
      <div className="p-4 text-center text-red-600">Error loading runs</div>
    )
  }

  // When using backend data, runs are already paginated by the API
  // When using mock data, we need to paginate locally
  const runsToDisplay = backendData?.runs
    ? dataToUse.runs // Already paginated by backend
    : paginateRunData(
        dataToUse.runs,
        currentGroupPage || pagination[depositedLocation] || 1,
        10,
      ).items

  return (
    <TableContainer className="!px-0">
      <SDSTable className="!table-fixed">
        <TableHeader>
          <CellHeader style={{ width: '350px' }}>
            {t('annotationName')}
          </CellHeader>
          <CellHeader style={{ width: '160px' }}>
            {t('objectShapeType')}
          </CellHeader>
          <CellHeader style={{ width: '160px' }}>{t('methodType')}</CellHeader>
        </TableHeader>
        <tbody>
          {runsToDisplay.map((run) => {
            const isRunExpanded =
              expandedRuns[depositedLocation]?.[run.runName] || false

            // Calculate pagination variables for this run
            const runCurrentPage =
              runPagination[depositedLocation]?.[run.runName] || 1
            const runPageSize = 5
            const totalRunPages = Math.ceil(run.items.length / runPageSize)

            return (
              <RunRow
                key={run.runName}
                run={run}
                depositionId={depositionId}
                isExpanded={isRunExpanded}
                onToggle={() => onRunToggle(depositedLocation, run.runName)}
                currentPage={runCurrentPage}
                totalPages={totalRunPages}
                onPageChange={(newPage) =>
                  onRunPageChange(depositedLocation, run.runName, newPage)
                }
                annotationCount={run.annotationCount}
              />
            )
          })}
        </tbody>
      </SDSTable>
    </TableContainer>
  )
}
