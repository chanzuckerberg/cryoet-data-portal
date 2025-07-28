import {
  GetDepositionBaseDataV2Query,
  GetDepositionLegacyDataV2Query,
} from 'app/__generated_v2__/graphql'

export type Dataset = GetDepositionLegacyDataV2Query['datasets'][number]
export type Deposition = GetDepositionBaseDataV2Query['depositions'][number]
