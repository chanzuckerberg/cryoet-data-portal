import { DeepPartial } from 'utility-types'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'
import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'
import { I18nKeys } from 'app/types/i18n'

export type DrawerMetadataValue = number | string | null | undefined | string[]

export type DrawerTestMetadata = DeepPartial<
  Record<I18nKeys, DrawerMetadataValue>
>

export interface DrawerTestData {
  title: string
  metadata: DrawerTestMetadata
}

export type Dataset =
  | GetDatasetByIdQuery['datasets'][number]
  | GetRunByIdV2Query['runs'][number]['dataset']

export type TiltSeries =
  GetDatasetByIdQuery['datasets'][number]['run_metadata'][number]['tiltseries'][number] &
    GetRunByIdV2Query['runs'][number]['tiltseries']['edges'][number]
