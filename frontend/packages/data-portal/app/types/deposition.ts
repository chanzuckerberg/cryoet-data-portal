export interface RunData<T> {
  id: number
  runName: string
  items: T[]
  annotationCount?: number
  tomogramCount?: number
}

export interface DepositedLocationData<T> {
  depositedLocation: string
  runs: RunData<T>[]
}

export interface AnnotationRowData {
  id: number
  annotationName: string
  shapeType: string
  methodType: string
  depositedIn: string
  depositedLocation: string
  runName: string
  objectName?: string
  confidence?: number
  description?: string
  fileFormat?: string
  s3Path?: string
  groundTruthStatus?: boolean
}

export interface TomogramRowData {
  id: number
  name: string
  depositedIn: string
  depositedLocation: string
  runName: string
  keyPhotoUrl?: string
  voxelSpacing: number
  reconstructionMethod: string
  processing: string
  neuroglancerConfig?: string
}
