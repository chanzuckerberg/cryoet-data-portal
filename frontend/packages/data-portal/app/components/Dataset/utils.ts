import { UnfilteredRun } from 'app/types/gql/datasetPageTypes'
import { getDataContents } from 'app/utils/deposition'

export interface SummaryData {
  annotations: number
  tomograms: number
  frames: string
  tiltSeries: string
  ctf: string
  alignment: string
}

export const getContentSummaryCounts = (runs: UnfilteredRun[]): SummaryData => {
  const dataContents = getDataContents(runs)

  return {
    annotations: dataContents.annotations,
    tomograms: dataContents.tomograms,
    frames: dataContents.framesAvailable ? 'Available' : 'Not Submitted',
    tiltSeries: dataContents.tiltSeriesAvailable
      ? 'Available'
      : 'Not Submitted',
    ctf: dataContents.ctfAvailable ? 'Available' : 'Not Submitted',
    alignment: dataContents.alignmentAvailable ? 'Available' : 'Not Submitted',
  }
}
