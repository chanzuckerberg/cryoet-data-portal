import { CellHeaderDirection } from '@czi-sds/components'
import { json, LoaderFunctionArgs } from '@remix-run/node'

import { OrderBy } from 'app/__generated_v2__/graphql'
import { apolloClient, apolloClientV2 } from 'app/apollo.server'
import { DatasetTable } from 'app/components/BrowseData'
import { BrowseDataSearch } from 'app/components/BrowseData/BrowseDataSearch'
import { DatasetFilter } from 'app/components/DatasetFilter'
import { NoFilteredResults } from 'app/components/NoFilteredResults'
import {
  TableHeaderDefinition,
  TableHeaderProps,
  TablePageLayout,
} from 'app/components/TablePageLayout'
import { DATASET_FILTERS } from 'app/constants/filterQueryParams'
import { QueryParams } from 'app/constants/query'
import { getBrowseDatasetsV2 } from 'app/graphql/getBrowseDatasetsV2.server'
import { getDatasetsFilterData } from 'app/graphql/getDatasetsFilterData.server'
import { useDatasets } from 'app/hooks/useDatasets'
import { useI18n } from 'app/hooks/useI18n'
import {
  useBrowseDatasetFilterHistory,
  useSyncParamsWithState,
} from 'app/state/filterHistory'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')
  const sort = (url.searchParams.get(QueryParams.Sort) ?? undefined) as
    | CellHeaderDirection
    | undefined
  const query = url.searchParams.get(QueryParams.Search) ?? ''

  let orderBy: OrderBy | null = null

  if (sort) {
    orderBy = sort === 'asc' ? OrderBy.Asc : OrderBy.Desc
  }

  const [datasetsResponse, datasetsFilterResponse] = await Promise.all([
    getBrowseDatasetsV2({
      orderBy,
      page,
      query,
      client: apolloClientV2,
      params: url.searchParams,
    }),
    getDatasetsFilterData({ client: apolloClient }),
  ])

  return json({
    datasetsData: datasetsResponse.data,
    datasetsFilterData: datasetsFilterResponse.data,
  })
}

function BrowseDatasetTableHeader(props: TableHeaderProps) {
  return <TableHeaderDefinition {...props} search={<BrowseDataSearch />} />
}

export default function BrowseDatasetsPage() {
  const { totalDatasetCount, filteredDatasetCount } = useDatasets()
  const { t } = useI18n()

  const { setPreviousBrowseDatasetParams } = useBrowseDatasetFilterHistory()

  useSyncParamsWithState({
    filters: DATASET_FILTERS,
    setParams: setPreviousBrowseDatasetParams,
  })

  return (
    <TablePageLayout
      tabs={[
        {
          title: t('datasets'),
          description: t('datasetsDescription'),
          learnMoreLink:
            'https://chanzuckerberg.github.io/cryoet-data-portal/cryoet_data_portal_docsite_data.html#datasets',
          filterPanel: <DatasetFilter />,
          table: <DatasetTable />,
          noFilteredResults: <NoFilteredResults showSearchTip />,
          filteredCount: filteredDatasetCount,
          totalCount: totalDatasetCount,
          countLabel: t('datasets'),
          Header: BrowseDatasetTableHeader,
        },
      ]}
    />
  )
}
