import { RunData } from 'app/types/deposition'
import { DataContentsType } from 'app/types/deposition-queries'

// Expandable row header props
export interface ExpandableRowHeaderProps {
  runName: string
  isExpanded: boolean
  onToggle: () => void
  totalCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
  itemLabel: string // "annotation" or "tomogram"
  itemsLabel: string // "annotations" or "tomograms"
  colSpan: number // 3 for annotations, 7 for tomograms
}

// Base table props
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

// Configuration for table specialization
export interface LocationTableConfig<TRowData> {
  dataContentType: DataContentsType
  tableHeaders: React.ReactNode[]
  renderRow: (props: RowRenderProps<TRowData>) => React.ReactNode
  skeletonColSpan: number
}

// Row render props
export interface RowRenderProps<TRowData> {
  run: RunData<TRowData>
  depositionId: number
  isExpanded: boolean
  onToggle: () => void
  currentPage: number
  onPageChange: (page: number) => void
  location: string
}
