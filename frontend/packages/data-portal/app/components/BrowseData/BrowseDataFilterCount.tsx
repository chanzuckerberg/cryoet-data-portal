import { useSearchParams } from '@remix-run/react'

import { useDatasets } from 'app/hooks/useDatasets'
import { i18n } from 'app/i18n'

export function BrowseDataFilterCount() {
  const { datasetCount, filteredDatasetCount } = useDatasets()
  const [searchParams] = useSearchParams()

  if (!searchParams.get('search')) {
    return null
  }

  return (
    <div className="w-full pl-sds-s">
      <p className="text-sm text-sds-gray-500">
        {i18n.datasetCount(filteredDatasetCount, datasetCount)}
      </p>
    </div>
  )
}
