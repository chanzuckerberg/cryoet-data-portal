import { GetDatasetByIdQuery, GetRunByIdQuery } from 'app/__generated__/graphql'
import { I18nKeys } from 'app/types/i18n'

export type DrawerMetadataValue = number | string | null | undefined | string[]

export type DrawerTestMetadata = Partial<Record<I18nKeys, DrawerMetadataValue>>

export interface DrawerTestData {
  title: string
  metadata: DrawerTestMetadata
}

export type Dataset =
  | GetDatasetByIdQuery['datasets'][number]
  | GetRunByIdQuery['runs'][number]['dataset']

export type TiltSeries =
  GetDatasetByIdQuery['datasets'][number]['run_metadata'][number]['tiltseries'][number] &
    GetRunByIdQuery['runs'][number]['tiltseries'][number]
