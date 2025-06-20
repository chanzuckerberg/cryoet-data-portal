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
  const {
    annotations,
    tomograms,
    framesAvailable,
    tiltSeriesAvailable,
    ctfAvailable,
    alignmentAvailable,
  } = getDataContents(runs)

  return {
    annotations,
    tomograms,
    frames: framesAvailable ? 'Available' : 'Not Submitted',
    tiltSeries: tiltSeriesAvailable ? 'Available' : 'Not Submitted',
    ctf: ctfAvailable ? 'Available' : 'Not Submitted',
    alignment: alignmentAvailable ? 'Available' : 'Not Submitted',
  }
}
