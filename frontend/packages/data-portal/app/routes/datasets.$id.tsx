/* eslint-disable @typescript-eslint/no-throw-literal */

import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClient } from 'app/apollo.server'
import { DatasetMetadataDrawer } from 'app/components/Dataset'
import { DatasetHeader } from 'app/components/Dataset/DatasetHeader'
import { RunsTable } from 'app/components/Dataset/RunsTable'
import { DownloadModal } from 'app/components/Download'
import { RunFilter } from 'app/components/RunFilter'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { QueryParams } from 'app/constants/query'
import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'

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
    params: url.searchParams,
  })

  if (data.datasets.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Dataset with ID ${id} not found`,
    })
  }

  return json(data)
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
          s3Path={dataset.s3_prefix}
          type="dataset"
        />
      }
      drawers={<DatasetMetadataDrawer />}
      filteredCount={dataset.filtered_runs_count.aggregate?.count ?? 0}
      header={<DatasetHeader />}
      table={<RunsTable />}
      totalCount={dataset.runs_aggregate.aggregate?.count ?? 0}
      filters={<RunFilter />}
    />
  )
}
