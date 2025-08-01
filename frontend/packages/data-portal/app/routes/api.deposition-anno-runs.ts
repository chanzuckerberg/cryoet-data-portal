import { LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClientV2 } from 'app/apollo.server'
import { getDepositionAnnoRunsForDataset } from 'app/graphql/getDepositionRunsV2.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionId = url.searchParams.get('depositionId')
  const datasetId = url.searchParams.get('datasetId')
  const page = url.searchParams.get('page')

  if (!depositionId || Number.isNaN(Number(depositionId))) {
    return new Response('Missing or invalid depositionId', { status: 400 })
  }

  if (!datasetId || Number.isNaN(Number(datasetId))) {
    return new Response('Missing or invalid datasetId', { status: 400 })
  }

  if (!page || Number.isNaN(Number(page))) {
    return new Response('Missing or invalid page', { status: 400 })
  }

  try {
    const result = await getDepositionAnnoRunsForDataset({
      client: apolloClientV2,
      depositionId: Number(depositionId),
      datasetId: Number(datasetId),
      page: Number(page),
    })

    return new Response(JSON.stringify(result.data), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch deposition annotation runs:', error)
    return new Response('Failed to fetch deposition annotation runs', {
      status: 500,
    })
  }
}
