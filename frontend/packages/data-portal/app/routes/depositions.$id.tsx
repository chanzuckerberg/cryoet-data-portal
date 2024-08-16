/* eslint-disable @typescript-eslint/no-throw-literal */

import { CellHeaderDirection } from '@czi-sds/components'
import { json, LoaderFunctionArgs, redirect } from '@remix-run/server-runtime'

import { Order_By } from 'app/__generated__/graphql'
import { apolloClient } from 'app/apollo.server'
import { DatasetFilter } from 'app/components/DatasetFilter'
import { DepositionMetadataDrawer } from 'app/components/Deposition'
import { DatasetsTable } from 'app/components/Deposition/DatasetsTable'
import { DepositionHeader } from 'app/components/Deposition/DepositionHeader'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { QueryParams } from 'app/constants/query'
import { getDatasetsFilterData } from 'app/graphql/getDatasetsFilterData.server'
import { getDepositionById } from 'app/graphql/getDepositionById.server'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getFeatureFlag } from 'app/utils/featureFlags'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  const showDepositions = getFeatureFlag({
    env: process.env.ENV,
    key: 'depositions',
    params: url.searchParams,
  })

  if (!showDepositions) {
    return redirect('/404')
  }

  const id = params.id ? +params.id : NaN
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')
  const sort = (url.searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  let orderBy: Order_By | null = null

  if (sort) {
    orderBy = sort === 'asc' ? Order_By.Asc : Order_By.Desc
  }

  const [depositionResponse, datasetsFilterReponse] = await Promise.all([
    getDepositionById({
      id,
      orderBy,
      page,
      client: apolloClient,
      params: url.searchParams,
    }),
    getDatasetsFilterData({
      client: apolloClient,
      filter: {},
      // TODO: uncomment below when deposition fields added to backend
      // filter: { deposition_id: { _eq: id } },
    }),
  ])

  if (depositionResponse.data.deposition === null) {
    throw new Response(null, {
      status: 404,
      statusText: `Deposition with ID ${id} not found`,
    })
  }

  return json({
    depositionData: depositionResponse.data,
    datasetsFilterData: datasetsFilterReponse.data,
  })
}

export default function DatasetByIdPage() {
  const { deposition } = useDepositionById()
  const { t } = useI18n()

  return (
    <TablePageLayout
      header={<DepositionHeader />}
      tabs={[
        {
          title: t('depositionData'),
          table: <DatasetsTable />,
          totalCount: deposition.datasets_aggregate.aggregate?.count ?? 0,
          filteredCount:
            deposition.filtered_datasets_aggregate.aggregate?.count ?? 0,
          filterPanel: <DatasetFilter depositionPageVariant />,
          countLabel: t('datasets'),
        },
      ]}
      drawers={<DepositionMetadataDrawer />}
    />
  )
}
