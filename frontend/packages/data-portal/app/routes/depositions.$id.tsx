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
import { DepositionHeader } from 'app/components/Deposition/DepositionHeader'
import { DepositionMetadataDrawer } from 'app/components/Deposition/DepositionMetadataDrawer'
import { DepositionTableRenderer } from 'app/components/Deposition/DepositionTableRenderer'
import { NoFilteredResults } from 'app/components/NoFilteredResults'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { TableCountHeader } from 'app/components/TablePageLayout/TableCountHeader'
import { DEPOSITION_FILTERS } from 'app/constants/filterQueryParams'
import { QueryParams } from 'app/constants/query'
import { getDepositionAnnotations } from 'app/graphql/getDepositionAnnotationsV2.server'
import { getDepositionByIdV2 } from 'app/graphql/getDepositionByIdV2.server'
import {getVoodoo} from 'app/graphql/getVoodooExperimentV2.server'
import {
  getDatasetsForDepositionViaTomograms,
  getDatasetsForDepositionViaAnnotationShapes,
} from 'app/graphql/getDatasetsForDepositionV2.server'
import { getDepositionTomograms } from 'app/graphql/getDepositionTomogramsV2.server'
import { useDatasetsFilterData } from 'app/hooks/useDatasetsFilterData'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { DepositionTab, useDepositionTab } from 'app/hooks/useDepositionTab'
import { useI18n } from 'app/hooks/useI18n'
import {
  useDepositionHistory,
  useSyncParamsWithState,
} from 'app/state/filterHistory'
import { getFeatureFlag, useFeatureFlag } from 'app/utils/featureFlags'
import { shouldRevalidatePage } from 'app/utils/revalidate'

export async function loader({ params, request }: LoaderFunctionArgs) {
  console.log("HELLO VOODOO FROM DEPOSITION LOADER"); // REMOVE
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

  // VOODOO Begin Vincent work, giant block of example query usage, not for real use!
  const voodooResponse = await getVoodoo({
    client,
    id,
  })
  console.log("voodooResponse", voodooResponse); // REMOVE
  console.log("voodooResponse.data.depositions", voodooResponse.data.depositions); // REMOVE
  const voodooData = voodooResponse.data;

  const { data: datasetsViaTomograms } = await getDatasetsForDepositionViaTomograms({
    client,
    depositionId: id,
  })

  const { data: datasetsViaAnnotationShapes } = await getDatasetsForDepositionViaAnnotationShapes({
    client,
    depositionId: id,
  })

  // END VOODOO End Vincent work for requests to GraphQL
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
    // VOODOO below this line is Vincent demo stuff
    voodooData: voodooData,
    datasetsViaTomograms,
    datasetsViaAnnotationShapes,
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
  console.log("deposition", deposition); // REMOVE
  console.log("annotationsCount", annotationsCount); // REMOVE
  console.log("tomogramsCount", tomogramsCount); // REMOVE
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

  return (
    <TablePageLayout
      title={t('depositedData')}
      header={<DepositionHeader />}
      tabs={[
        {
          countLabel: t('datasets'),
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
