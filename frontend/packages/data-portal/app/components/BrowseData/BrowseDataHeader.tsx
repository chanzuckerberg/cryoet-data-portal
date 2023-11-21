import { BrowseDataSearch } from './BrowseDataSearch'
import { BrowseDataTabs } from './BrowseDataTabs'

export function BrowseDataHeader() {
  return (
    <div className="px-sds-xl py-sds-l flex justify-center">
      <div className="flex gap-sds-xl w-full max-w-content">
        <BrowseDataSearch />
        <BrowseDataTabs />
      </div>
    </div>
  )
}
