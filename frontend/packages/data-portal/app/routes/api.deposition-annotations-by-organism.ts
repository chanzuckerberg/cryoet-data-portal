import type { LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClientV2 } from 'app/apollo.server'
import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { getDepositionAnnotations } from 'app/graphql/getDepositionAnnotationsV2.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionId = url.searchParams.get('depositionId')
  const organismName = url.searchParams.get('organismName')
  const page = url.searchParams.get('page') || '1'
  const pageSize =
    url.searchParams.get('pageSize') || String(MAX_PER_FULLY_OPEN_ACCORDION)

  if (!depositionId || Number.isNaN(Number(depositionId))) {
    return new Response('Missing or invalid depositionId', { status: 400 })
  }

  if (!organismName) {
    return new Response('Missing organismName', { status: 400 })
  }

  const pageNumber = Number(page)
  const pageSizeNumber = Number(pageSize)

  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    return new Response('Invalid page number', { status: 400 })
  }

  if (Number.isNaN(pageSizeNumber) || pageSizeNumber < 1) {
    return new Response('Invalid page size', { status: 400 })
  }

  try {
    // Create URL search params with organism filter
    const params = new URLSearchParams()
    params.set(QueryParams.Organism, organismName)

    const { data } = await getDepositionAnnotations({
      client: apolloClientV2,
      depositionId: Number(depositionId),
      page: pageNumber,
      pageSize: pageSizeNumber,
      params,
    })

    const annotations = data.annotationShapes || []

    return new Response(
      JSON.stringify({
        annotations,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch annotations by organism:', error)
    return new Response('Failed to fetch annotations', { status: 500 })
  }
}
