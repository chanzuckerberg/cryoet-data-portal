/* eslint-disable @typescript-eslint/no-throw-literal */

import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClient } from 'app/apollo.server'
import { DatasetMetadataDrawer } from 'app/components/Dataset'
import { DatasetHeader } from 'app/components/Dataset/DatasetHeader'
import { RunsTable } from 'app/components/Dataset/RunsTable'
import { DownloadModal } from 'app/components/Download'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { QueryParams } from 'app/constants/query'
import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'
import { shouldRevalidatePage } from 'app/utils/revalidate'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  const url = new URL(request.url)
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const { data } = await getDatasetById({
    id,
    page,
    client: apolloClient,
  })

  if (data.datasets.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Dataset with ID ${id} not found`,
    })
  }

  return json(data)
}

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage(args)
}

export default function DatasetByIdPage() {
  const { dataset } = useDatasetById()

  return (
    <TablePageLayout
      type={i18n.runs}
      downloadModal={
        <DownloadModal
          datasetId={dataset.id}
          datasetTitle={dataset.title}
          s3DatasetPrefix={dataset.s3_prefix}
          type="dataset"
        />
      }
      drawers={<DatasetMetadataDrawer />}
      // TODO add filter count when filters are added
      filteredCount={dataset.runs_aggregate.aggregate?.count ?? 0}
      header={<DatasetHeader />}
      table={<RunsTable />}
      totalCount={dataset.runs_aggregate.aggregate?.count ?? 0}
    />
  )
}
