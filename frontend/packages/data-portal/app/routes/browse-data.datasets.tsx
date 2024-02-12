import { Button, CellHeaderDirection } from '@czi-sds/components'
import { json, LoaderFunctionArgs } from '@remix-run/node'

import { Order_By } from 'app/__generated__/graphql'
import { apolloClient } from 'app/apollo.server'
import { DatasetTable } from 'app/components/BrowseData'
import { DatasetFilter } from 'app/components/DatasetFilter'
import { ErrorBoundary } from 'app/components/ErrorBoundary'
import { NoResults } from 'app/components/NoResults'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'
import { useDatasetFilter } from 'app/hooks/useDatasetFilter'
import { useDatasets } from 'app/hooks/useDatasets'
import { i18n } from 'app/i18n'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = +(url.searchParams.get('page') ?? '1')
  const sort = (url.searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined
  const query = url.searchParams.get('search') ?? ''

  let orderBy: Order_By | null = null

  if (sort) {
    orderBy = sort === 'asc' ? Order_By.Asc : Order_By.Desc
  }

  const { data } = await getBrowseDatasets({
    orderBy,
    page,
    query,
    client: apolloClient,
    params: url.searchParams,
  })

  return json(data)
}

export default function BrowseDatasetsPage() {
  const { datasetCount, filteredDatasetCount } = useDatasets()
  const { reset } = useDatasetFilter()

  return (
    <TablePageLayout
      type={i18n.datasets}
      filteredCount={filteredDatasetCount}
      filters={
        <ErrorBoundary logId="dataset-root-filter">
          <DatasetFilter />
        </ErrorBoundary>
      }
      table={
        <ErrorBoundary logId="dataset-root-table">
          <DatasetTable />
        </ErrorBoundary>
      }
      totalCount={datasetCount}
      noResults={
        <NoResults
          title={i18n.filterNoResultsFound}
          description={i18n.filterTooRestrictive}
          actions={<Button onClick={reset}>{i18n.clearFilters}</Button>}
        />
      }
    />
  )
}
