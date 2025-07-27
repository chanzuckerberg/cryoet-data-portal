import type { LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClientV2 } from 'app/apollo.server'
import { getDepositionAnnoRunCountsForDatasets } from 'app/graphql/getDepositionRunsV2.server'

interface RunCountsResponse {
  runCounts: Record<number, number>
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionId = url.searchParams.get('depositionId')
  const datasetIds = url.searchParams.get('datasetIds')

  if (!depositionId || Number.isNaN(Number(depositionId))) {
    return new Response('Missing or invalid depositionId', { status: 400 })
  }

  if (!datasetIds) {
    return new Response('Missing datasetIds', { status: 400 })
  }

  try {
    const parsedDatasetIds = datasetIds
      .split(',')
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id))

    if (parsedDatasetIds.length === 0) {
      return new Response('No valid dataset IDs provided', { status: 400 })
    }

    const { data } = await getDepositionAnnoRunCountsForDatasets({
      client: apolloClientV2,
      depositionId: Number(depositionId),
      datasetIds: parsedDatasetIds,
    })

    // Transform the aggregated data into a map of datasetId -> runCount
    const runCounts: Record<number, number> = {}

    data.runsAggregate.aggregate?.forEach((agg) => {
      const datasetId = agg.groupBy?.dataset?.id
      if (datasetId && agg.count) {
        runCounts[datasetId] = agg.count
      }
    })

    const response: RunCountsResponse = {
      runCounts,
    }

    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch run counts for deposition:', error)
    return new Response('Failed to fetch run counts', { status: 500 })
  }
}
