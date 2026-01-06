import {
  GetDatasetsV2Query,
  GetDepositionBaseDataV2Query,
} from 'app/__generated_v2__/graphql'

export type Dataset = GetDatasetsV2Query['datasets'][number]
export type Deposition = GetDepositionBaseDataV2Query['depositions'][number]
