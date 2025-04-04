import { UnfilteredRun } from 'app/types/gql/datasetPageTypes'

export interface SummaryData {
  annotations: number
  tomograms: number
  frames: string
  tiltSeries: string
  ctf: string
  alignment: string
}

export const getContentSummaryCounts = (runs: UnfilteredRun[]): SummaryData => {
  let annotations = 0
  let tomograms = 0
  let framesAvailable = false
  let tiltSeriesAvailable = false
  let ctfAvailable = false
  let alignmentAvailable = false

  for (const run of runs) {
    annotations +=
      run.annotationsAggregate?.aggregate?.reduce(
        (sum, agg) => sum + (agg?.count || 0),
        0,
      ) || 0
    tomograms +=
      run.tomogramsAggregate?.aggregate?.reduce(
        (sum, agg) => sum + (agg?.count || 0),
        0,
      ) || 0
    framesAvailable ||=
      run.framesAggregate?.aggregate?.some((agg) => (agg?.count || 0) > 0) ||
      false
    tiltSeriesAvailable ||=
      run.tiltseriesAggregate?.aggregate?.some(
        (agg) => (agg?.count || 0) > 0,
      ) || false
    ctfAvailable ||=
      run.perSectionParametersAggregate?.aggregate?.some(
        (agg) => (agg?.count || 0) > 0,
      ) || false
    alignmentAvailable ||=
      run.alignmentsAggregate?.aggregate?.some(
        (agg) => (agg?.count || 0) > 0,
      ) || false
  }

  return {
    annotations,
    tomograms,
    frames: framesAvailable ? 'Available' : 'Not Submitted',
    tiltSeries: tiltSeriesAvailable ? 'Available' : 'Not Submitted',
    ctf: ctfAvailable ? 'Available' : 'Not Submitted',
    alignment: alignmentAvailable ? 'Available' : 'Not Submitted',
  }
}
