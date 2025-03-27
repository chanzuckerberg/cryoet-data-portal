import { Run } from 'app/__generated_v2__/graphql'

export const getContentSummaryCounts = (runs: Run[]) => {
  let annotations = 0
  let tomograms = 0
  let framesAvailable = false
  let tiltSeriesAvailable = false
  let alignmentAvailable = false

  runs.forEach((run) => {
    run.annotationsAggregate?.aggregate?.forEach((agg) => {
      if (agg?.count) {
        annotations += agg.count
      }
      return annotations
    })

    run.tomogramsAggregate?.aggregate?.forEach((agg) => {
      if (agg?.count) {
        tomograms += agg.count
      }
      return tomograms
    })

    run.framesAggregate?.aggregate?.forEach((agg) => {
      if (agg?.count && agg.count > 0) {
        framesAvailable = true
      }
    })

    run.tiltseriesAggregate?.aggregate?.forEach((agg) => {
      if (agg?.avg?.tiltSeriesQuality && agg.avg.tiltSeriesQuality > 0) {
        tiltSeriesAvailable = true
      }
    })

    run.alignmentsAggregate?.aggregate?.forEach((agg) => {
      if (agg?.count && agg.count > 0) {
        alignmentAvailable = true
      }
    })
  })

  return {
    annotations,
    tomograms,
    frames: framesAvailable ? 'Available' : 'Not Submitted',
    tiltSeries: tiltSeriesAvailable ? 'Available' : 'Not Submitted',
    alignment: alignmentAvailable ? 'Available' : 'Not Submitted',
  }
}
