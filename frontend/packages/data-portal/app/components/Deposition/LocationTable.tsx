import { CellHeader, Table as SDSTable, TableHeader } from '@czi-sds/components'
import TableContainer from '@mui/material/TableContainer'

import { useI18n } from 'app/hooks/useI18n'

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
}

export function LocationTable({
  locationData,
  pagination,
  runPagination,
  expandedRuns,
  onRunToggle,
  onRunPageChange,
}: LocationTableProps) {
  const { t } = useI18n()
  const { depositedLocation } = locationData
  const currentPage = pagination[depositedLocation] || 1
  const pageSize = 10

  // Paginate runs
  const paginatedRuns = paginateRunData(
    locationData.runs,
    currentPage,
    pageSize,
  )

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
          <CellHeader> </CellHeader>
        </TableHeader>
        <tbody>
          {paginatedRuns.items.map((run) => {
            const isExpanded =
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
                depositedLocation={depositedLocation}
                isExpanded={isExpanded}
                onToggle={() => onRunToggle(depositedLocation, run.runName)}
                currentPage={runCurrentPage}
                totalPages={totalRunPages}
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
