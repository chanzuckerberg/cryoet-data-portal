import { GroupedData } from 'app/components/GroupedAccordion'
import {
  AnnotationRowData,
  DepositedLocationData,
  TomogramRowData,
} from 'app/types/deposition'
import { DataContentsType } from 'app/types/deposition-queries'

import { AnnotationLocationTable } from './AnnotationLocationTable'
import { TomogramLocationTable } from './TomogramLocationTable'

type GroupedDepositedLocationData = GroupedData<
  DepositedLocationData<AnnotationRowData | TomogramRowData>
>

interface DepositedLocationAccordionContentProps {
  group: GroupedDepositedLocationData
  isExpanded: boolean
  currentPage: number
  tab: DataContentsType
  depositionId: number
  datasets:
    | Array<{
        id: number
        title: string
        organismName: string | null
      }>
    | null
    | undefined
  runPagination: Record<string, Record<string, number>>
  expandedRuns: Record<string, Record<string, boolean>>
  onRunToggle: (location: string, runName: string) => void
  onRunPageChange: (location: string, runName: string, newPage: number) => void
}

export function DepositedLocationAccordionContent({
  group,
  isExpanded,
  currentPage,
  tab,
  depositionId,
  datasets,
  runPagination,
  expandedRuns,
  onRunToggle,
  onRunPageChange,
}: DepositedLocationAccordionContentProps) {
  if (!isExpanded || group.items.length === 0) {
    return null
  }

  const datasetId = parseInt(group.groupKey, 10)
  const dataset = datasets?.find((d) => d.id === datasetId)

  if (!dataset) {
    return null
  }

  const Table =
    tab === DataContentsType.Tomograms
      ? TomogramLocationTable
      : AnnotationLocationTable

  return (
    <Table
      runPagination={runPagination}
      expandedRuns={expandedRuns}
      onRunToggle={onRunToggle}
      onRunPageChange={onRunPageChange}
      currentGroupPage={currentPage}
      depositionId={depositionId}
      datasetId={datasetId}
      datasetTitle={dataset.title}
      isExpanded={isExpanded}
    />
  )
}
