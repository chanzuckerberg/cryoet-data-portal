/* eslint-disable @typescript-eslint/ban-ts-comment */

import { InputSearch } from '@czi-sds/components'

import { i18n } from 'app/i18n'

import { BrowseDataTabs } from './BrowseDataTabs'

export function BrowseDataHeader() {
  return (
    <div className="px-sds-xl py-sds-l flex items-center gap-sds-xl border-b border-gray-300">
      <InputSearch
        id="data-search"
        label={i18n.search}
        sdsStyle="rounded"
        placeholder={i18n.search}
      />

      <BrowseDataTabs />
    </div>
  )
}
