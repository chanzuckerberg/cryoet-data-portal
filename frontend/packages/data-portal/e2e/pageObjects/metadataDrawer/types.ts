import { DeepPartial } from 'utility-types'

import { I18nKeys } from 'app/types/i18n'

export type DrawerMetadataValue = number | string | null | undefined | string[]

export type DrawerTestMetadata = DeepPartial<
  Record<I18nKeys, DrawerMetadataValue>
>

export interface DrawerTestData {
  title: string
  metadata: DrawerTestMetadata
}
