/* eslint-disable @typescript-eslint/no-throw-literal */

import { lazy, Suspense } from 'react'
import { type LoaderFunctionArgs } from '@remix-run/server-runtime'
import { typedjson } from 'remix-typedjson'

import { QueryParams } from 'app/constants/query'
import { getRunByIdV2 } from 'app/graphql/getRunByIdV2.server'
import { useRunById } from 'app/hooks/useRunById'
import { apolloClientV2 } from 'app/apollo.server'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const url = new URL(request.url)
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
  })
}

const ViewerPage = lazy(() => import('app/components/Run/ViewerPage'))

export default function RunByIdViewerPage() {
  const { run, tomograms } = useRunById()
  const tomogram = tomograms.find((t) => t.neuroglancerConfig)
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ViewerPage run={run} tomogram={tomogram} />
    </Suspense>
  )
}
