import { Table as SDSTable, TableHeader } from '@czi-sds/components'
import TableContainer from '@mui/material/TableContainer'

import { CellHeader } from 'app/components/Table'
import { DepositionTomogramTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramRowData } from 'app/hooks/useTomogramData'

import {
  DepositedLocationData,
  paginateRunData,
} from './mockDepositedLocationData'
import { TomogramRow } from './TomogramRow'

interface TomogramLocationTableProps {
  locationData: DepositedLocationData<TomogramRowData>
  pagination: Record<string, number>
  runPagination: Record<string, Record<string, number>>
  expandedRuns: Record<string, Record<string, boolean>>
  onRunToggle: (location: string, runName: string) => void
  onRunPageChange: (location: string, runName: string, newPage: number) => void
  currentGroupPage?: number // Page from GroupedAccordion for runs pagination
}

export function TomogramLocationTable({
  locationData,
  pagination,
  runPagination,
  expandedRuns,
  onRunToggle,
  onRunPageChange,
  currentGroupPage,
}: TomogramLocationTableProps) {
  const { t } = useI18n()
  const { depositedLocation } = locationData
  const currentPage = currentGroupPage || pagination[depositedLocation] || 1
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
          {paginatedRuns.items.map((run) => {
            const isExpanded =
              expandedRuns[depositedLocation]?.[run.runName] || false

            // Calculate pagination variables for this run
            const runCurrentPage =
              runPagination[depositedLocation]?.[run.runName] || 1
            const runPageSize = 5
            const totalRunPages = Math.ceil(run.items.length / runPageSize)

            return (
              <TomogramRow
                key={run.runName}
                run={run}
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
