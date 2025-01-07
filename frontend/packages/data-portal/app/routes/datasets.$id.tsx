/* eslint-disable @typescript-eslint/no-throw-literal */

import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClient, apolloClientV2 } from 'app/apollo.server'
import { DatasetMetadataDrawer } from 'app/components/Dataset'
import { DatasetHeader } from 'app/components/Dataset/DatasetHeader'
import { RunsTable } from 'app/components/Dataset/RunsTable'
import { DepositionFilterBanner } from 'app/components/DepositionFilterBanner'
import { DownloadModal } from 'app/components/Download'
import { NoFilteredResults } from 'app/components/NoFilteredResults'
import { RunFilter } from 'app/components/RunFilter'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { RUN_FILTERS } from 'app/constants/filterQueryParams'
import { QueryParams } from 'app/constants/query'
import { getDatasetById } from 'app/graphql/getDatasetById.server'
import { logIfHasDiff } from 'app/graphql/getDatasetByIdDiffer'
import { getDatasetByIdV2 } from 'app/graphql/getDatasetByIdV2.server'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'
import { useQueryParam } from 'app/hooks/useQueryParam'
import { i18n } from 'app/i18n'
import {
  useSingleDatasetFilterHistory,
  useSyncParamsWithState,
} from 'app/state/filterHistory'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  const url = new URL(request.url)
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')
  const depositionId = Number(url.searchParams.get(QueryParams.DepositionId))

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const [{ data: responseV1 }, { data: responseV2 }] = await Promise.all([
    getDatasetById({
      id,
      page,
      client: apolloClient,
      params: url.searchParams,
      depositionId: Number.isNaN(depositionId) ? undefined : depositionId,
    }),
    getDatasetByIdV2({
      id,
      page,
      client: apolloClientV2,
      params: url.searchParams,
      depositionId: Number.isNaN(depositionId) ? undefined : depositionId,
    }),
  ])

  if (responseV1.datasets.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Dataset with ID ${id} not found`,
    })
  }

  try {
    logIfHasDiff(request.url, responseV1, responseV2)
  } catch (error) {
    // eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    console.log(`DIFF ERROR: ${(error as any)?.stack}`)
  }

  return json({
    v1: responseV1,
    v2: responseV2,
  })
}

export default function DatasetByIdPage() {
  const { dataset, deposition } = useDatasetById()
  const { t } = useI18n()
  const [depositionId] = useQueryParam<string>(QueryParams.DepositionId)

  const { setPreviousSingleDatasetParams } = useSingleDatasetFilterHistory()

  useSyncParamsWithState({
    filters: RUN_FILTERS,
    setParams: setPreviousSingleDatasetParams,
  })

  return (
    <TablePageLayout
      banner={
        depositionId &&
        deposition && (
          <DepositionFilterBanner
            deposition={deposition}
            labelI18n="onlyDisplayingRunsWithAnnotations"
          />
        )
      }
      header={<DatasetHeader />}
      tabs={[
        {
          title: t('runs'),
          filterPanel: <RunFilter />,
          table: <RunsTable />,
          filteredCount: dataset.filtered_runs_count.aggregate?.count ?? 0,
          totalCount: dataset.runs_aggregate.aggregate?.count ?? 0,
          countLabel: i18n.runs,
          noFilteredResults: <NoFilteredResults />,
        },
      ]}
      downloadModal={
        <DownloadModal
          datasetId={dataset.id}
          datasetTitle={dataset.title}
          s3Path={dataset.s3_prefix}
          type="dataset"
        />
      }
      drawers={<DatasetMetadataDrawer />}
    />
  )
}
