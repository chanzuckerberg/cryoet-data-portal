/* eslint-disable @typescript-eslint/no-throw-literal */

import { type LoaderFunctionArgs } from '@remix-run/server-runtime'
import { lazy, Suspense } from 'react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { type GetRunByIdV2Query } from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'
import { QueryParams } from 'app/constants/query'
import { getRunByIdV2 } from 'app/graphql/getRunByIdV2.server'
import { useRunById } from 'app/hooks/useRunById'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const url = new URL(request.url)
  const shouldStartTour = url.searchParams.get(QueryParams.ShowTour) === 'true'

  const annotationsPage = +(
    url.searchParams.get(QueryParams.AnnotationsPage) ?? '1'
  )
  const depositionId = Number(url.searchParams.get(QueryParams.DepositionId))

  const { data: responseV2 } = await getRunByIdV2({
    client: apolloClientV2,
    id,
    annotationsPage,
    params: url.searchParams,
    depositionId: Number.isNaN(depositionId) ? undefined : depositionId,
  })

  if (responseV2.runs.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Run with ID ${id} not found`,
    })
  }

  return typedjson({
    v2: responseV2,
    shouldStartTour,
  })
}

const ViewerPage = lazy(() =>
  import('app/components/Viewer/ViewerPage').then((mod) => ({
    default: mod.ViewerPage,
  })),
)

export default function RunByIdViewerPage() {
  const { run } = useRunById()
  const { shouldStartTour } = useTypedLoaderData<{
    v2: GetRunByIdV2Query
    shouldStartTour: boolean
  }>()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewerPage run={run} shouldStartTour={shouldStartTour} />
    </Suspense>
  )
}
