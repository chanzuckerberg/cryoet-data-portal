import { GetDatasetByIdV2Query } from 'app/__generated_v2__/graphql'

export type Run = GetDatasetByIdV2Query['runs'][number]
export type UnfilteredRun = GetDatasetByIdV2Query['unFilteredRuns'][number]
