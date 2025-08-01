// Types for RunData and AnnotationRowData
export interface RunData<T> {
  id: number
  runName: string
  items: T[]
  annotationCount?: number
}

export interface AnnotationRowData {
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

export interface RunRowProps {
  run: RunData<AnnotationRowData>
  depositionId: number
  annotationCount?: number
  isExpanded: boolean
  onToggle: () => void
  currentPage: number
  // totalPages: number // Not used when backend data is available
  onPageChange: (page: number) => void
}

export interface RunRowHeaderProps {
  runName: string
  isExpanded: boolean
  onToggle: () => void
  totalCount: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
}
