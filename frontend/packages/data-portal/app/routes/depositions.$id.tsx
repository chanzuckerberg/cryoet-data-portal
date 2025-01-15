/* eslint-disable @typescript-eslint/no-throw-literal */

import { CellHeaderDirection } from '@czi-sds/components'
import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { LoaderFunctionArgs, redirect } from '@remix-run/server-runtime'
import { useEffect } from 'react'
import { typedjson } from 'remix-typedjson'

import { Order_By } from 'app/__generated__/graphql'
import { OrderBy } from 'app/__generated_v2__/graphql'
import { apolloClient, apolloClientV2 } from 'app/apollo.server'
import { DatasetFilter } from 'app/components/DatasetFilter'
import { DepositionMetadataDrawer } from 'app/components/Deposition'
import { DatasetsTable } from 'app/components/Deposition/DatasetsTable'
import { DepositionHeader } from 'app/components/Deposition/DepositionHeader'
import { NoFilteredResults } from 'app/components/NoFilteredResults'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { DEPOSITION_FILTERS } from 'app/constants/filterQueryParams'
import { QueryParams } from 'app/constants/query'
import { getAnnotationCountForAnnotationMethod } from 'app/graphql/getAnnotationCountForAnnotationMethod'
import { getDatasetsFilterData } from 'app/graphql/getDatasetsFilterData.server'
import { getDepositionById } from 'app/graphql/getDepositionById.server'
import { getDepositionByIdV2 } from 'app/graphql/getDepositionByIdV2.server'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import {
  useDepositionHistory,
  useSyncParamsWithState,
} from 'app/state/filterHistory'
import { getFeatureFlag } from 'app/utils/featureFlags'
import { shouldRevalidatePage } from 'app/utils/revalidate'

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
  const sort = (url.searchParams.get(QueryParams.Sort) ?? undefined) as
    | CellHeaderDirection
    | undefined

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  let orderBy: Order_By | null = null
  let orderByV2: OrderBy | undefined

  if (sort) {
    orderBy = sort === 'asc' ? Order_By.Asc : Order_By.Desc
    orderByV2 = sort === 'asc' ? OrderBy.Asc : OrderBy.Desc
  }

  const [
    { data: responseV1 },
    { data: datasetsFilterReponse },
    { data: responseV2 },
  ] = await Promise.all([
    getDepositionById({
      id,
      orderBy,
      page,
      client: apolloClient,
      params: url.searchParams,
    }),
    getDatasetsFilterData({
      client: apolloClient,
      depositionId: id,
    }),
    getDepositionByIdV2({
      client: apolloClientV2,
      id,
      orderBy: orderByV2,
      page,
      params: url.searchParams,
    }),
  ])

  if (responseV1.deposition == null) {
    throw new Response(null, {
      status: 404,
      statusText: `Deposition with ID ${id} not found`,
    })
  }

  const { deposition } = responseV1

  const annotationMethodCounts = new Map(
    await Promise.all(
      deposition.annotation_methods.map((annotationMethod) =>
        getAnnotationCountForAnnotationMethod({
          client: apolloClient,
          depositionId: deposition.id,
          annotationMethod: annotationMethod.annotation_method,
        }).then(
          (result) =>
            [
              annotationMethod.annotation_method,
              result.data.annotation_count.aggregate?.count ?? 0,
            ] as const,
        ),
      ),
    ),
  )

  return typedjson({
    v1: responseV1,
    v1FilterValues: datasetsFilterReponse,
    annotationMethodCounts,
    v2: responseV2,
  })
}

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({
    ...args,
    paramsToRefetch: [
      QueryParams.GroundTruthAnnotation,
      QueryParams.AvailableFiles,
      QueryParams.NumberOfRuns,
      QueryParams.DatasetId,
      QueryParams.EmpiarId,
      QueryParams.EmdbId,
      QueryParams.AuthorName,
      QueryParams.AuthorOrcid,
      QueryParams.Organism,
      QueryParams.CameraManufacturer,
      QueryParams.TiltRangeMin,
      QueryParams.TiltRangeMax,
      QueryParams.FiducialAlignmentStatus,
      QueryParams.ReconstructionMethod,
      QueryParams.ReconstructionMethod,
      QueryParams.ObjectName,
      QueryParams.ObjectId,
      QueryParams.ObjectShapeType,
      QueryParams.Sort,
    ],
  })
}

export default function DepositionByIdPage() {
  const { deposition, datasetsCount, filteredDatasetsCount } =
    useDepositionById()
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

  return (
    <TablePageLayout
      header={<DepositionHeader />}
      tabs={[
        {
          title: t('datasetsWithDepositionData'),
          table: <DatasetsTable />,
          totalCount: datasetsCount,
          filteredCount: filteredDatasetsCount,
          filterPanel: <DatasetFilter depositionPageVariant />,
          countLabel: t('datasets'),
          noFilteredResults: <NoFilteredResults />,
        },
      ]}
      drawers={<DepositionMetadataDrawer />}
    />
  )
}
