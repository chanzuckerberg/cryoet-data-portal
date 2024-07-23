import { Button, CellHeaderDirection } from '@czi-sds/components'
import { json, LoaderFunctionArgs, redirect } from '@remix-run/node'

import { Order_By } from 'app/__generated__/graphql'
import { apolloClient } from 'app/apollo.server'
import { DepositionTable } from 'app/components/BrowseData/DepositionTable'
import { NoResults } from 'app/components/NoResults'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { getBrowseDepositions } from 'app/graphql/getBrowseDepositions.server'
import { useDepositions } from 'app/hooks/useDepositions'
import { useFilter } from 'app/hooks/useFilter'
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

  const page = +(url.searchParams.get('page') ?? '1')
  const sort = (url.searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined
  const query = url.searchParams.get('search') ?? ''

  let orderBy: Order_By | null = null

  if (sort) {
    orderBy = sort === 'asc' ? Order_By.Asc : Order_By.Desc
  }

  const { data } = await getBrowseDepositions({
    orderBy,
    page,
    query,
    client: apolloClient,
    params: url.searchParams,
  })

  return json(data)
}

export default function BrowseDepositionsPage() {
  // TODO: hook up to backend when available
  const { depositionCount, filteredDepositionCount } = useDepositions()
  const { reset } = useFilter()
  const { t } = useI18n()

  return (
    <TablePageLayout
      tabs={[
        {
          title: t('depositions'),
          filteredCount: filteredDepositionCount,
          table: <DepositionTable />,
          noResults: (
            <NoResults
              title={t('filterNoResultsFound')}
              description={t('filterTooRestrictive')}
              actions={<Button onClick={reset}>{t('clearFilters')}</Button>}
            />
          ),
          totalCount: depositionCount,
          countLabel: t('depositions'),
        },
      ]}
    />
  )
}
