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
import {
  getDepositionAnnotations,
  getDepositionAnnotationsForDatasets,
} from 'app/graphql/getDepositionAnnotationsV2.server'
import { getDepositionByIdV2 } from 'app/graphql/getDepositionByIdV2.server'
import {
  getDatasetsForDepositionViaTomograms,
  getDatasetsForDepositionViaAnnotationShapes,
} from 'app/graphql/getDatasetsForDepositionV2.server'
import {
  getDepositionAnnoRunCountsForDatasets,
  getDepositionAnnoRunsForDataset,
  getAnnotationsForRunAndDeposition,
} from 'app/graphql/getDepositionRunsV2.server'
import { getDepositionTomograms } from 'app/graphql/getDepositionTomogramsV2.server'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab, useDepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import { useQueryParam } from 'app/hooks/useQueryParam'
import {
  useDepositionHistory,
  useSyncParamsWithState,
} from 'app/state/filterHistory'
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
  const { data: responseV2 } = await getDepositionByIdV2({
    client,
    id,
    page,
    orderBy: orderByV2,
    params: url.searchParams,
  })

  // BEGIN VINCENT_WORK, giant block of example query usage, not for real use!
  const { data: datasetsViaTomograms } = await getDatasetsForDepositionViaTomograms({
    client,
    depositionId: id,
  })

  const { data: datasetsViaAnnotationShapes } = await getDatasetsForDepositionViaAnnotationShapes({
    client,
    depositionId: id,
  })

  // PROGRAMATICALLY PULL the following array based on boiling down one of the two
  // `datasetsViaBlah` results into the datasets associated with either anno or tomo flavor.
  // Sorry I didn't have time to write the code for extracting these dataset ids!
  const EXAMPLE_ALL_DATASET_IDS = [10301, 10302]
  const { data: runCountsForDepositionAnnotations} = await getDepositionAnnoRunCountsForDatasets({
    client,
    depositionId: id,
    datasetIds: EXAMPLE_ALL_DATASET_IDS,
  })

  // MANUALLY SET the following dataset id based on deposition you are dev-ing against.
  // This is a rough example of how user interaction would go. For deposition id 10314,
  // the user has chosen to expand the accordion of dataset id 10301, so now showing
  // the run info for that dataset.
  const EXAMPLE_DATASET_ID = 10301
  const { data: runsAnnoForDepositionInDataset } = await getDepositionAnnoRunsForDataset({
    client,
    depositionId: id,
    datasetId: EXAMPLE_DATASET_ID,
    page: 1,
  })

  // MANUALLY SET the following run id based on depostion+dataset you are dev-ing against.
  // This is a rough example of how user interaction would go. For deposition id 10314,
  // the user has chosen to expand the accordion of dataset id 10301, and within that,
  // has selected run id 14070, so now showing annotations for that run in the deposition.
  const EXAMPLE_RUN_ID = 14070
  const { data: annotationsForRunInDeposition } = await getAnnotationsForRunAndDeposition({
    client,
    depositionId: id,
    runId: EXAMPLE_RUN_ID,
    page: 1,
  })

  // MANUALLY SET the following array based on deposition you are dev-ing against.
  // Here as a rough example of how user interaction would go. For deposition id 10314
  // it has two datasets of id 10301 and 10302, so we choose some subset of those.
  const EXAMPLE_FILTERED_DATASET_IDS = [10301]
  const { data: annotationShapesForDatasets } = await getDepositionAnnotationsForDatasets({
    client,
    depositionId: id,
    datasetIds: EXAMPLE_FILTERED_DATASET_IDS,
    page: 1,
  })
  // END VINCENT_WORK for requests to GraphQL
  // There is more Vincent stuff put in to the response and the use hook

  if (responseV2.depositions.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Deposition with ID ${id} not found`,
    })
  }

  const isExpandDepositions = getFeatureFlag({
    env: process.env.ENV,
    key: 'expandDepositions',
    params: url.searchParams,
  })

  const depositionTab = url.searchParams.get(
    QueryParams.DepositionTab,
  ) as DepositionTab | null

  const { data } = await match({
    isExpandDepositions,
    depositionTab,
  })
    .with(
      {
        isExpandDepositions: true,
        depositionTab: P.union(DepositionTab.Annotations, null),
      },
      () =>
        getDepositionAnnotations({
          client,
          id,
          page,
        }),
    )
    .with(
      {
        isExpandDepositions: true,
        depositionTab: DepositionTab.Tomograms,
      },
      () =>
        getDepositionTomograms({
          client,
          id,
          page,
        }),
    )
    .otherwise(() => ({ data: undefined }))

  return typedjson({
    v2: responseV2,
    annotations: data && 'annotationShapes' in data ? data : undefined,
    tomograms: data && 'tomograms' in data ? data : undefined,
    datasetsViaTomograms,
    datasetsViaAnnotationShapes,
    runCountsForDepositionAnnotations,
    runsAnnoForDepositionInDataset,
    annotationsForRunInDeposition,
    annotationShapesForDatasets,
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
              { isExpandDepositions: true, tab: DepositionTab.Annotations },
              () => t('annotations'),
            )
            .with(
              { isExpandDepositions: true, tab: DepositionTab.Tomograms },
              () => t('tomograms'),
            )
            .otherwise(() => t('datasets')),
          noFilteredResults: <NoFilteredResults />,
          title: t('datasetsWithDepositionData'),
          Header: isExpandDepositions ? TableCountHeader : undefined,

          table: isExpandDepositions ? (
            <DepositionTableRenderer />
          ) : (
            <DatasetsTable />
          ),

          totalCount: match({ isExpandDepositions, tab })
            .with(
              { isExpandDepositions: true, tab: DepositionTab.Annotations },
              () => annotationsCount,
            )
            .with(
              { isExpandDepositions: true, tab: DepositionTab.Tomograms },
              () => tomogramsCount,
            )
            .otherwise(() => totalDatasetsCount),

          // TODO replace annotations and tomograms with filtered counts
          filteredCount: match({ isExpandDepositions, tab })
            .with(
              { isExpandDepositions: true, tab: DepositionTab.Annotations },
              () => annotationsCount,
            )
            .with(
              { isExpandDepositions: true, tab: DepositionTab.Tomograms },
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
