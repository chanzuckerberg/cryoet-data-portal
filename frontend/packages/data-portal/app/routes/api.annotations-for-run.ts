import { LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClientV2 } from 'app/apollo.server'
import { getAnnotationsForRunAndDeposition } from 'app/graphql/getDepositionRunsV2.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionId = url.searchParams.get('depositionId')
  const runId = url.searchParams.get('runId')
  const page = url.searchParams.get('page')

  if (!depositionId || Number.isNaN(Number(depositionId))) {
    return new Response('Missing or invalid depositionId', { status: 400 })
  }

  if (!runId || Number.isNaN(Number(runId))) {
    return new Response('Missing or invalid runId', { status: 400 })
  }

  if (!page || Number.isNaN(Number(page))) {
    return new Response('Missing or invalid page', { status: 400 })
  }

  try {
    const result = await getAnnotationsForRunAndDeposition({
      client: apolloClientV2,
      depositionId: Number(depositionId),
      runId: Number(runId),
      page: Number(page),
    })

    return new Response(JSON.stringify(result.data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch annotations for run and deposition:', error)
    return new Response('Failed to fetch annotations for run and deposition', {
      status: 500,
    })
  }
}
