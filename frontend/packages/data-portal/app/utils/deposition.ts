import type { DataContentsFragment } from 'app/__generated_v2__/graphql'
import type { TomogramRowData } from 'app/hooks/useTomogramData'

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

// Types for deposition backend integration
interface BackendRun {
  __typename?: 'Run' | undefined
  id: number
  name: string
  annotationsAggregate?:
    | {
        __typename?: 'AnnotationAggregate' | undefined
        aggregate?:
          | {
              __typename?: 'AnnotationAggregateFunctions' | undefined
              count?: number | null | undefined
            }[]
          | null
          | undefined
      }
    | null
    | undefined
}

interface BackendTomogramRun {
  __typename?: 'Run' | undefined
  id: number
  name: string
  tomogramsAggregate?:
    | {
        __typename?: 'TomogramAggregate' | undefined
        aggregate?:
          | {
              __typename?: 'TomogramAggregateFunctions' | undefined
              count?: number | null | undefined
            }[]
          | null
          | undefined
      }
    | null
    | undefined
}

interface AnnotationRowData {
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

interface RunData<T> {
  id: number
  runName: string
  items: T[]
  annotationCount?: number
  tomogramCount?: number
}

interface DepositedLocationData<T> {
  depositedLocation: string
  runs: RunData<T>[]
}

/**
 * Transforms backend run data to the component format expected by LocationTable
 */
export function transformBackendRunsToComponentFormat(
  backendRuns: BackendRun[],
  datasetTitle: string,
): DepositedLocationData<AnnotationRowData> {
  return {
    depositedLocation: datasetTitle,
    runs: backendRuns.map((run) => ({
      id: run.id,
      runName: run.name,
      items: [], // Empty for unexpanded case
      annotationCount: run.annotationsAggregate?.aggregate?.[0]?.count || 0,
    })),
  }
}

/**
 * Transforms backend tomogram run data to the component format expected by TomogramLocationTable
 */
export function transformBackendTomoRunsToComponentFormat(
  backendRuns: BackendTomogramRun[],
  datasetTitle: string,
): DepositedLocationData<TomogramRowData> {
  return {
    depositedLocation: datasetTitle,
    runs: backendRuns.map((run) => ({
      id: run.id,
      runName: run.name,
      items: [], // Empty for unexpanded case
      tomogramCount: run.tomogramsAggregate?.aggregate?.[0]?.count || 0,
    })),
  }
}
