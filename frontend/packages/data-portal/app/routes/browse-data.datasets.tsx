import { CellHeaderDirection } from '@czi-sds/components'
import { json, LoaderFunctionArgs } from '@remix-run/node'

import { Order_By } from 'app/__generated__/graphql'
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
import { getBrowseDatasets } from 'app/graphql/getBrowseDatasets.server'
import { logIfHasDiff } from 'app/graphql/getDatasetsDiffer'
import { getDatasetsFilterData } from 'app/graphql/getDatasetsFilterData.server'
import { getDatasetsV2 } from 'app/graphql/getDatasetsV2.server'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
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

  let orderBy: Order_By | null = null
  let orderByV2: OrderBy | undefined

  if (sort) {
    orderBy = sort === 'asc' ? Order_By.Asc : Order_By.Desc
    orderByV2 = sort === 'asc' ? OrderBy.Asc : OrderBy.Desc
  }

  const [
    { data: responseV1 },
    { data: filterValuesResponseV1 },
    { data: responseV2 },
  ] = await Promise.all([
    getBrowseDatasets({
      orderBy,
      page,
      query,
      client: apolloClient,
      params: url.searchParams,
    }),
    getDatasetsFilterData({ client: apolloClient }),
    getDatasetsV2({
      page,
      titleOrderDirection: orderByV2,
      searchText: query,
      params: url.searchParams,
      client: apolloClientV2,
    }),
  ])

  try {
    logIfHasDiff(request.url, responseV1, filterValuesResponseV1, responseV2)
  } catch (error) {
    // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    console.log(`DIFF ERROR: ${(error as any)?.stack}`)
  }

  return json({
    v1: responseV1,
    v1FilterValues: filterValuesResponseV1,
    v2: responseV2,
  })
}

function BrowseDatasetTableHeader(props: TableHeaderProps) {
  return <TableHeaderDefinition {...props} search={<BrowseDataSearch />} />
}

export default function BrowseDatasetsPage() {
  const { filteredDatasetsCount, totalDatasetsCount } = useDatasetsFilterData()
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
            'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_data.html#datasets',
          filterPanel: <DatasetFilter />,
          table: <DatasetTable />,
          noFilteredResults: <NoFilteredResults showSearchTip />,
          filteredCount: filteredDatasetsCount,
          totalCount: totalDatasetsCount,
          countLabel: t('datasets'),
          Header: BrowseDatasetTableHeader,
        },
      ]}
    />
  )
}
