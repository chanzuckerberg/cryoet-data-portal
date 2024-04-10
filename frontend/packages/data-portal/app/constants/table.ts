export type TableColumnWidth = {
  max?: number
  min?: number
}

export const DatasetTableWidths = {
  id: { min: 450, max: 800 },
  empiarId: { min: 120, max: 130 },
  organismName: { min: 100, max: 400 },
  runs: { min: 70, max: 100 },
  annotatedObjects: { min: 120, max: 400 },
}

export const AnnotationTableWidths = {
  id: { min: 250 },
  confidenceCell: { min: 81, max: 120 },
  depositionDate: { min: 91, max: 120 },
  objectName: { min: 120, max: 250 },
  files: { min: 100, max: 150 },
  methodType: { min: 81, max: 120 },
  actions: { min: 120, max: 120 },
}

export const RunTableWidths = {
  name: { min: 400 },
  tiltSeriesQuality: { min: 120, max: 210 },
  annotatedObjects: { min: 250, max: 400 },
  actions: { min: 150, max: 200 },
}
