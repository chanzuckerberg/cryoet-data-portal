import { useLoaderData, useSearchParams } from '@remix-run/react'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'
import { i18n } from 'app/i18n'

export function BrowseDataFilterCount() {
  const data = useLoaderData<GetDatasetsDataQuery>()
  const [searchParams] = useSearchParams()

  if (!searchParams.get('search')) {
    return null
  }

  return (
    <div className="w-full pl-sds-s">
      <p className="text-sm text-sds-gray-500">
        {i18n.datasetCount(
          data.filtered_datasets_aggregate.aggregate?.count ?? 0,
          data.datasets_aggregate.aggregate?.count ?? 0,
        )}
      </p>
    </div>
  )
}
