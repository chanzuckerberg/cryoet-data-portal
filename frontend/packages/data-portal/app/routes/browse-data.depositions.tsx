import { CellHeaderDirection } from '@czi-sds/components'
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'

import { OrderBy } from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'
import { DepositionTable } from 'app/components/BrowseData/DepositionTable'
import { DepositionsFilters } from 'app/components/DepositionsFilters/DepositionsFilters'
import { NoFilteredResults } from 'app/components/NoFilteredResults'
import {
  TableHeaderDefinition,
  TablePageLayout,
} from 'app/components/TablePageLayout'
import { QueryParams } from 'app/constants/query'
import { getBrowseDepositionsV2 } from 'app/graphql/getBrowseDepositionsV2.server'
import { useDepositions } from 'app/hooks/useDepositions'
import { useI18n } from 'app/hooks/useI18n'
import { getFeatureFlag } from 'app/utils/featureFlags'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  const showDepositions = getFeatureFlag({
    env: process.env.ENV,
    key: 'depositions',
    params: url.searchParams,
  })

  if (!showDepositions) {
    return redirect('/404')
  }

  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')
  const sort = (url.searchParams.get(QueryParams.Sort) ?? undefined) as
    | CellHeaderDirection
    | undefined

  const orderByV2 = sort === 'asc' ? OrderBy.Asc : OrderBy.Desc

  const { data: responseV2 } = await getBrowseDepositionsV2({
    orderBy: orderByV2,
    page,
    client: apolloClientV2,
    params: url.searchParams,
  })

  return json({
    v2: responseV2,
    orderBy: orderByV2,
  })
}

export default function BrowseDepositionsPage() {
  const { totalDepositionCount, filteredDepositionCount } = useDepositions()
  const { t } = useI18n()

  return (
    <TablePageLayout
      tabs={[
        {
          title: t('depositions'),
          description: t('depositionsDescription'),
          learnMoreLink:
            'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_data.html#depositions',
          table: <DepositionTable />,
          filterPanel: <DepositionsFilters />,
          filteredCount: filteredDepositionCount,
          totalCount: totalDepositionCount,
          countLabel: t('depositions'),
          Header: TableHeaderDefinition,
          noFilteredResults: <NoFilteredResults />,
        },
      ]}
    />
  )
}
