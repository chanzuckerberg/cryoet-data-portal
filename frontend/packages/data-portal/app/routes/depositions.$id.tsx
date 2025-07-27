/* eslint-disable @typescript-eslint/no-throw-literal */

import { CellHeaderDirection } from '@czi-sds/components'
import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { LoaderFunctionArgs } from '@remix-run/server-runtime'
import { useEffect } from 'react'
import { typedjson } from 'remix-typedjson'
import { match, P } from 'ts-pattern'

import { OrderBy } from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'
import { DatasetFilter } from 'app/components/DatasetFilter'
import { DatasetsTable } from 'app/components/Deposition/DatasetsTable'
import { DepositionFilters } from 'app/components/Deposition/DepositionFilters'
import { DepositionGroupByControl } from 'app/components/Deposition/DepositionGroupByControl'
import { DepositionHeader } from 'app/components/Deposition/DepositionHeader'
import { DepositionMetadataDrawer } from 'app/components/Deposition/DepositionMetadataDrawer'
import { DepositionTableRenderer } from 'app/components/Deposition/DepositionTableRenderer'
import { NoFilteredResults } from 'app/components/NoFilteredResults'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { TableCountHeader } from 'app/components/TablePageLayout/TableCountHeader'
import { DEPOSITION_FILTERS } from 'app/constants/filterQueryParams'
import { QueryParams } from 'app/constants/query'
import { getDepositionAnnotations } from 'app/graphql/getDepositionAnnotationsV2.server'
import {
  getDepositionBaseData,
  getDepositionExpandedData,
  getDepositionLegacyData,
} from 'app/graphql/getDepositionByIdV2.server'
import { getDepositionTomograms } from 'app/graphql/getDepositionTomogramsV2.server'
import { useDatasetPagination } from 'app/hooks/useDatasetPagination'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useDepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { useOrganismPagination } from 'app/hooks/useOrganismPagination'
import { useQueryParam } from 'app/hooks/useQueryParam'
import { useDatasetsForDeposition } from 'app/queries/useDatasetsForDeposition'
import { useDepositionRunCounts } from 'app/queries/useDepositionRunCounts'
import {
  useDepositionHistory,
  useSyncParamsWithState,
} from 'app/state/filterHistory'
import { DataContentsType } from 'app/types/deposition-queries'
import { GroupByOption } from 'app/types/depositionTypes'
import { getFeatureFlag, useFeatureFlag } from 'app/utils/featureFlags'
import { shouldRevalidatePage } from 'app/utils/revalidate'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  const id = params.id ? +params.id : NaN
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')
  const sort = (url.searchParams.get(QueryParams.Sort) ?? undefined) as
    | CellHeaderDirection
    | undefined

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  let orderByV2: OrderBy | undefined

  if (sort) {
    orderByV2 = sort === 'asc' ? OrderBy.Asc : OrderBy.Desc
  }

  const client = apolloClientV2

  const isExpandDepositions = getFeatureFlag({
    env: process.env.ENV,
    key: 'expandDepositions',
    params: url.searchParams,
  })

  const depositionTab = url.searchParams.get(
    QueryParams.DepositionTab,
  ) as DataContentsType | null

  // Check existence first
  const { data: responseV2 } = await getDepositionBaseData({
    client,
    id,
  })

  if (responseV2.depositions.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Deposition with ID ${id} not found`,
    })
  }

  // Then fetch remaining data in parallel

  const expandedDataPromise = isExpandDepositions
    ? getDepositionExpandedData({ client, id })
    : Promise.resolve({ data: undefined })

  const conditionalDataPromise = match({
    isExpandDepositions,
    depositionTab,
  })
    .with({ isExpandDepositions: false }, () =>
      getDepositionLegacyData({
        client,
        id,
        page,
        orderBy: orderByV2,
        params: url.searchParams,
      }),
    )
    .with(
      {
        isExpandDepositions: true,
        depositionTab: P.union(DataContentsType.Annotations, null),
      },
      () =>
        getDepositionAnnotations({
          client,
          page,
          depositionId: id,
          params: url.searchParams,
        }),
    )
    .with(
      {
        isExpandDepositions: true,
        depositionTab: DataContentsType.Tomograms,
      },
      () =>
        getDepositionTomograms({
          client,
          page,
          depositionId: id,
          params: url.searchParams,
        }),
    )
    .otherwise(() => Promise.resolve({ data: undefined }))

  const [{ data: expandedData }, { data }] = await Promise.all([
    expandedDataPromise,
    conditionalDataPromise,
  ])

  return typedjson({
    expandedData,
    v2: responseV2,
    legacyData: data && 'datasets' in data ? data : undefined,
    annotations: data && 'annotationShapes' in data ? data : undefined,
    tomograms: data && 'tomograms' in data ? data : undefined,
  })
}

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({
    ...args,
    paramsToRefetch: [
      QueryParams.AuthorName,
      QueryParams.AuthorOrcid,
      QueryParams.AvailableFiles,
      QueryParams.CameraManufacturer,
      QueryParams.DatasetId,
      QueryParams.DepositionTab,
      QueryParams.EmdbId,
      QueryParams.EmpiarId,
      QueryParams.FiducialAlignmentStatus,
      QueryParams.GroundTruthAnnotation,
      QueryParams.NumberOfRuns,
      QueryParams.ObjectId,
      QueryParams.ObjectName,
      QueryParams.ObjectShapeType,
      QueryParams.Organism,
      QueryParams.ReconstructionMethod,
      QueryParams.ReconstructionMethod,
      QueryParams.Sort,
      QueryParams.TiltRangeMax,
      QueryParams.TiltRangeMin,
    ],
  })
}

export default function DepositionByIdPage() {
  const { deposition, annotationsCount, tomogramsCount } = useDepositionById()
  const { filteredDatasetsCount, totalDatasetsCount } = useDatasetsFilterData()
  const { t } = useI18n()

  const { setPreviousDepositionId, setPreviousSingleDepositionParams } =
    useDepositionHistory()

  useEffect(
    () => setPreviousDepositionId(deposition.id),
    [deposition.id, setPreviousDepositionId],
  )

  useSyncParamsWithState({
    filters: DEPOSITION_FILTERS,
    setParams: setPreviousSingleDepositionParams,
  })

  const isExpandDepositions = useFeatureFlag('expandDepositions')

  const [tab] = useDepositionTab()

  const [groupBy] = useQueryParam<GroupByOption>(QueryParams.GroupBy, {
    defaultValue: GroupByOption.None,
    serialize: (value) => String(value),
    deserialize: (value) => (value as GroupByOption) || GroupByOption.None,
  })

  // Use organism pagination when grouped by organism
  const organismPagination = useOrganismPagination(
    isExpandDepositions && groupBy === GroupByOption.Organism
      ? deposition.id
      : undefined,
  )

  // Fetch annotation counts and run counts when grouped by deposited location
  const depositionIdForDatasets =
    isExpandDepositions && groupBy === GroupByOption.DepositedLocation
      ? deposition.id
      : undefined

  const { annotationCounts, datasets: allDatasets } = useDatasetsForDeposition({
    depositionId: depositionIdForDatasets,
    type: tab,
  })

  // Get dataset IDs for run counts
  const datasetIds = allDatasets.map((d) => d.id)
  const { data: runCountsData } = useDepositionRunCounts({
    depositionId: depositionIdForDatasets,
    datasetIds,
    type: DataContentsType.Annotations,
  })
  const { data: tomoRunCountsData } = useDepositionRunCounts({
    depositionId: depositionIdForDatasets,
    datasetIds,
    type: DataContentsType.Tomograms,
  })

  // Use dataset pagination when grouped by deposited location
  const datasetPagination = useDatasetPagination({
    depositionId: depositionIdForDatasets,
    annotationCounts,
    runCounts: runCountsData?.runCounts,
    tomogramRunCounts: tomoRunCountsData?.runCounts,
  })

  // Conditional no results component based on loading states
  const noFilteredResultsComponent = match({
    isExpandDepositions,
    tab,
    groupBy,
  })
    .with({ isExpandDepositions: true, groupBy: GroupByOption.Organism }, () =>
      !organismPagination.isLoading ? <NoFilteredResults /> : null,
    )
    .with(
      {
        isExpandDepositions: true,
        groupBy: GroupByOption.DepositedLocation,
      },
      () => (!datasetPagination.isLoading ? <NoFilteredResults /> : null),
    )
    .otherwise(() => <NoFilteredResults />)

  return (
    <TablePageLayout
      title={t('depositedData')}
      titleContent={isExpandDepositions ? <DepositionGroupByControl /> : null}
      header={<DepositionHeader />}
      tabs={[
        {
          countLabel: match({ isExpandDepositions, tab, groupBy })
            .with(
              {
                isExpandDepositions: true,
                groupBy: GroupByOption.DepositedLocation,
              },
              () => t('datasets'),
            )
            .with(
              { isExpandDepositions: true, groupBy: GroupByOption.Organism },
              () => t('organisms'),
            )
            .with(
              { isExpandDepositions: true, tab: DataContentsType.Annotations },
              () => t('annotations'),
            )
            .with(
              { isExpandDepositions: true, tab: DataContentsType.Tomograms },
              () => t('tomograms'),
            )
            .otherwise(() => t('datasets')),
          noFilteredResults: noFilteredResultsComponent,
          title: t('datasetsWithDepositionData'),
          Header: isExpandDepositions ? TableCountHeader : undefined,

          table: isExpandDepositions ? (
            <DepositionTableRenderer
              organisms={
                groupBy === GroupByOption.Organism
                  ? organismPagination.organisms
                  : undefined
              }
              organismCounts={
                groupBy === GroupByOption.Organism
                  ? organismPagination.organismCounts
                  : undefined
              }
              isOrganismsLoading={
                groupBy === GroupByOption.Organism
                  ? organismPagination.isLoading
                  : false
              }
              datasets={
                groupBy === GroupByOption.DepositedLocation
                  ? datasetPagination.datasets
                  : undefined
              }
              datasetCounts={
                groupBy === GroupByOption.DepositedLocation
                  ? datasetPagination.datasetCounts
                  : undefined
              }
            />
          ) : (
            <DatasetsTable />
          ),

          totalCount: match({ isExpandDepositions, tab, groupBy })
            .with(
              { isExpandDepositions: true, groupBy: GroupByOption.Organism },
              () => organismPagination.totalOrganismCount,
            )
            .with(
              {
                isExpandDepositions: true,
                groupBy: GroupByOption.DepositedLocation,
              },
              () => datasetPagination.totalDatasetCount,
            )
            .with(
              { isExpandDepositions: true, tab: DataContentsType.Annotations },
              () => annotationsCount,
            )
            .with(
              { isExpandDepositions: true, tab: DataContentsType.Tomograms },
              () => tomogramsCount,
            )
            .otherwise(() => totalDatasetsCount),

          // TODO replace annotations and tomograms with filtered counts
          filteredCount: match({ isExpandDepositions, tab, groupBy })
            .with(
              { isExpandDepositions: true, groupBy: GroupByOption.Organism },
              () => organismPagination.filteredOrganismCount,
            )
            .with(
              {
                isExpandDepositions: true,
                groupBy: GroupByOption.DepositedLocation,
              },
              () => datasetPagination.filteredDatasetCount,
            )
            .with(
              { isExpandDepositions: true, tab: DataContentsType.Annotations },
              () => annotationsCount,
            )
            .with(
              { isExpandDepositions: true, tab: DataContentsType.Tomograms },
              () => tomogramsCount,
            )
            .otherwise(() => filteredDatasetsCount),

          filterPanel: isExpandDepositions ? (
            <DepositionFilters />
          ) : (
            <DatasetFilter depositionPageVariant />
          ),
        },
      ]}
      drawers={<DepositionMetadataDrawer />}
    />
  )
}
