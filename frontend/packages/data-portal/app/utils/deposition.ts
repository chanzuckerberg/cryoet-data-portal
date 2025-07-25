import type { DataContentsFragment } from 'app/__generated_v2__/graphql'

interface DepositionWithId {
  id: number
}

export function getAdditionalContributingDepositions(
  depositionsWithAnnotations: DepositionWithId[] | null | undefined,
  depositionsWithTomograms: DepositionWithId[] | null | undefined,
  depositionsWithDatasets: DepositionWithId[] | null | undefined,
  originalDepositionId: number | null | undefined,
): number[] {
  return Array.from(
    new Set([
      ...(depositionsWithAnnotations?.map((dep) => dep.id) ?? []),
      ...(depositionsWithTomograms?.map((dep) => dep.id) ?? []),
      ...(depositionsWithDatasets?.map((dep) => dep.id) ?? []),
    ]),
  )
    .filter((id) => id !== originalDepositionId)
    .sort((a, b) => a - b)
}

export function getDataContents(runs: DataContentsFragment[]) {
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
    framesAvailable,
    tiltSeriesAvailable,
    ctfAvailable,
    alignmentAvailable,
  } as const
}
