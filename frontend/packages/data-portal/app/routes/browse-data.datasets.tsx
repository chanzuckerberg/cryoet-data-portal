import { CellHeaderDirection } from '@czi-sds/components'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useTypedLoaderData } from 'remix-typedjson'

import { OrderBy } from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'
import { DatasetTable } from 'app/components/BrowseData'
import { BrowseDataSearch } from 'app/components/BrowseData/BrowseDataSearch'
import { DatasetFilter } from 'app/components/DatasetFilter'
import { DepositionFilterBanner } from 'app/components/DepositionFilterBanner'
import { NoFilteredResults } from 'app/components/NoFilteredResults'
import {
  TableHeaderDefinition,
  TablePageLayout,
} from 'app/components/TablePageLayout'
import { TableHeaderProps } from 'app/components/TablePageLayout/types'
import { DATASET_FILTERS } from 'app/constants/filterQueryParams'
import { FromLocationKey, QueryParams } from 'app/constants/query'
import { getDatasetsV2 } from 'app/graphql/getDatasetsV2.server'
import { getDepositionBaseData } from 'app/graphql/getDepositionByIdV2.server'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
import { useI18n } from 'app/hooks/useI18n'
import { useQueryParam } from 'app/hooks/useQueryParam'
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
  const depositionId = url.searchParams.get(QueryParams.DepositionId)

  let orderByV2: OrderBy | undefined

  if (sort) {
    orderByV2 = sort === 'asc' ? OrderBy.Asc : OrderBy.Desc
  }

  const { data: responseV2 } = await getDatasetsV2({
    page,
    titleOrderDirection: orderByV2,
    searchText: query,
    params: url.searchParams,
    client: apolloClientV2,
  })

  // Fetch deposition data if deposition ID is provided
  let deposition = null
  if (depositionId) {
    try {
      const { data: depositionData } = await getDepositionBaseData({
        client: apolloClientV2,
        id: Number(depositionId),
      })
      deposition = depositionData.depositions[0] || null
    } catch {
      // If deposition fetch fails, continue without it
      deposition = null
    }
  }

  return json({
    v2: responseV2,
    deposition,
  })
}

function BrowseDatasetTableHeader(props: TableHeaderProps) {
  return <TableHeaderDefinition {...props} search={<BrowseDataSearch />} />
}

export default function BrowseDatasetsPage() {
  const { filteredDatasetsCount, totalDatasetsCount } = useDatasetsFilterData()
  const { t } = useI18n()
  const [depositionId, setDepositionId] = useQueryParam<string>(
    QueryParams.DepositionId,
  )
  const [organism, setOrganism] = useQueryParam<string>(QueryParams.Organism)
  const [fromLocation, setFromLocation] = useQueryParam<FromLocationKey>(
    QueryParams.From,
  )

  const { previousBrowseDatasetParams, setPreviousBrowseDatasetParams } =
    useBrowseDatasetFilterHistory()

  useSyncParamsWithState({
    filters: DATASET_FILTERS,
    setParams: setPreviousBrowseDatasetParams,
  })

  const handleRemoveFilter = () => {
    setFromLocation(null)
    setOrganism(null)
    setDepositionId(null)

    const nextParams = new URLSearchParams(previousBrowseDatasetParams)
    nextParams.delete(QueryParams.DepositionId)
    nextParams.delete(QueryParams.Organism)
    nextParams.delete(QueryParams.From)
    nextParams.sort()
    setPreviousBrowseDatasetParams(nextParams.toString())
  }

  // Get deposition data from loader
  const { deposition } = useTypedLoaderData<{
    v2: unknown
    deposition: { id: number; title: string } | null
  }>()

  // Show banner when all conditions are met
  const shouldShowBanner = Boolean(
    depositionId &&
      organism &&
      fromLocation === FromLocationKey.DepositionAnnotations &&
      deposition,
  )

  return (
    <TablePageLayout
      banner={
        shouldShowBanner &&
        deposition && (
          <DepositionFilterBanner
            label={t('onlyDisplayingDatasetsWithOrganismAndDeposition', {
              replace: {
                organismName: organism,
                depositionId: deposition.id,
                depositionName: deposition.title,
              },
            })}
            onRemoveFilter={handleRemoveFilter}
          />
        )
      }
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
