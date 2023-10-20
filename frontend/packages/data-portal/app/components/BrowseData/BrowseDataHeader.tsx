/* eslint-disable @typescript-eslint/ban-ts-comment */

import { BrowseDataSearch } from './BrowseDataSearch'
import { BrowseDataTabs } from './BrowseDataTabs'

export function BrowseDataHeader() {
  return (
    <div className="px-sds-xl py-sds-l flex items-center gap-sds-xl border-b border-gray-300">
      <BrowseDataSearch />
      <BrowseDataTabs />
    </div>
  )
}
