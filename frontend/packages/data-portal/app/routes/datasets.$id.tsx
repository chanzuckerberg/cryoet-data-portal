/* eslint-disable @typescript-eslint/no-throw-literal */

import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import { match, P } from 'ts-pattern'

import { apolloClientV2 } from 'app/apollo.server'
import { DatasetMetadataDrawer } from 'app/components/Dataset'
import { DatasetHeader } from 'app/components/Dataset/DatasetHeader'
import { RunsTable } from 'app/components/Dataset/RunsTable'
import { getContentSummaryCounts } from 'app/components/Dataset/utils'
import { DepositionFilterBanner } from 'app/components/DepositionFilterBanner'
import { DownloadModal } from 'app/components/Download'
import { I18n } from 'app/components/I18n'
import { NoFilteredResults } from 'app/components/NoFilteredResults'
import { RunFilter } from 'app/components/RunFilter'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { RUN_FILTERS } from 'app/constants/filterQueryParams'
import { FromLocationKey, QueryParams } from 'app/constants/query'
import { getDatasetByIdV2 } from 'app/graphql/getDatasetByIdV2.server'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useI18n } from 'app/hooks/useI18n'
import { useQueryParam } from 'app/hooks/useQueryParam'
import { i18n } from 'app/i18n'
import {
  useDepositionHistory,
  useSingleDatasetFilterHistory,
  useSyncParamsWithState,
} from 'app/state/filterHistory'
import { useFeatureFlag } from 'app/utils/featureFlags'
import { shouldRevalidatePage } from 'app/utils/revalidate'

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

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({
    ...args,
    paramsToRefetch: [
      QueryParams.ObjectName,
      QueryParams.ObjectId,
      QueryParams.ObjectShapeType,
      QueryParams.MethodType,
      QueryParams.AnnotationsPage,
      QueryParams.DepositionId,
      QueryParams.TiltRangeMin,
      QueryParams.TiltRangeMax,
      QueryParams.QualityScore,
      QueryParams.GroundTruthAnnotation,
    ],
  })
}

export default function DatasetByIdPage() {
  const { dataset, deposition, unFilteredRuns } = useDatasetById()
  const { t } = useI18n()
  const [depositionId, setDepositionId] = useQueryParam<string>(
    QueryParams.DepositionId,
  )
  const [fromLocation, setFromLocation] = useQueryParam<FromLocationKey>(
    QueryParams.From,
  )
  const isExpandDepositions = useFeatureFlag('expandDepositions')

  const { previousSingleDepositionParams } = useDepositionHistory()
  const { previousSingleDatasetParams, setPreviousSingleDatasetParams } =
    useSingleDatasetFilterHistory()

  useSyncParamsWithState({
    filters: RUN_FILTERS,
    setParams: setPreviousSingleDatasetParams,
  })

  const handleRemoveDepositionFilter = () => {
    setDepositionId(null)

    // Also clear from parameter when expandDepositions feature flag is enabled
    if (isExpandDepositions) {
      setFromLocation(null)
    }

    const nextParams = new URLSearchParams(previousSingleDatasetParams)
    nextParams.delete(QueryParams.DepositionId)
    nextParams.delete(QueryParams.From)
    nextParams.sort()
    setPreviousSingleDatasetParams(nextParams.toString())
  }

  const label = isExpandDepositions
    ? t('onlyDisplayingRunsFromDeposition', {
        id: deposition?.id,
        name: deposition?.title,
      })
    : deposition && (
        <I18n
          i18nKey="onlyDisplayingRunsWithAnnotations"
          values={{
            id: deposition.id,
            title: deposition.title,
            url: `/depositions/${deposition.id}?${previousSingleDepositionParams}`,
          }}
          tOptions={{ interpolation: { escapeValue: false } }}
        />
      )

  const banner = match({
    depositionId,
    deposition,
    isExpandDepositions,
    fromLocation,
  })
    .with({ depositionId: P.nullish }, { deposition: P.nullish }, () => null)
    .otherwise(() => (
      <DepositionFilterBanner
        label={label}
        onRemoveFilter={handleRemoveDepositionFilter}
      />
    ))

  return (
    <TablePageLayout
      banner={banner}
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
          totalRuns={dataset.runsAggregate?.aggregate?.[0]?.count ?? 0}
          datasetContentsSummary={getContentSummaryCounts(unFilteredRuns)}
          type="dataset"
        />
      }
      drawers={<DatasetMetadataDrawer />}
    />
  )
}
