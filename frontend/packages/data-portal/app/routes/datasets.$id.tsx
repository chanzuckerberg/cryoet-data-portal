/* eslint-disable @typescript-eslint/no-throw-literal */

import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClientV2 } from 'app/apollo.server'
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

  const { data: responseV2 } = await getDatasetByIdV2({
    id,
    page,
    client: apolloClientV2,
    params: url.searchParams,
    depositionId: Number.isNaN(depositionId) ? undefined : depositionId,
  })

  if (responseV2.datasets.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Dataset with ID ${id} not found`,
    })
  }

  return json({
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
          filteredCount: dataset.filteredRunsCount?.aggregate?.[0]?.count ?? 0,
          totalCount: dataset.runsAggregate?.aggregate?.[0]?.count ?? 0,
          countLabel: i18n.runs,
          noFilteredResults: <NoFilteredResults />,
        },
      ]}
      downloadModal={
        <DownloadModal
          datasetId={dataset.id}
          datasetTitle={dataset.title}
          s3Path={dataset.s3Prefix}
          fileSize={dataset.fileSize ?? undefined}
          type="dataset"
        />
      }
      drawers={<DatasetMetadataDrawer />}
    />
  )
}
