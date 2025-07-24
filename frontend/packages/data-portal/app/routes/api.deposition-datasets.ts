import { LoaderFunctionArgs } from '@remix-run/server-runtime'

import { getDatasetsForDepositionViaAnnotationShapes } from 'app/graphql/getDatasetsForDepositionV2.server'

interface DatasetOption {
  id: number
  title: string
  organismName: string | null
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionId = url.searchParams.get('depositionId')

  if (!depositionId || Number.isNaN(Number(depositionId))) {
    return new Response('Missing or invalid depositionId', { status: 400 })
  }

  try {
    const { data } = await getDatasetsForDepositionViaAnnotationShapes(
      Number(depositionId),
    )

    // Transform data to DatasetOption[]
    const datasets: DatasetOption[] = []
    const seenIds = new Set<number>()

    data.annotationShapesAggregate.aggregate?.forEach((item) => {
      const dataset = item.groupBy?.annotation?.run?.dataset
      if (dataset?.id && dataset?.title && !seenIds.has(dataset.id)) {
        datasets.push({
          id: dataset.id,
          title: dataset.title,
          organismName: dataset.organismName ?? null,
        })
        seenIds.add(dataset.id)
      }
    })

    // Sort datasets by title for consistent ordering
    const sortedDatasets = datasets.sort((a, b) =>
      a.title.localeCompare(b.title),
    )

    return new Response(JSON.stringify({ datasets: sortedDatasets }), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch datasets for deposition:', error)
    return new Response('Failed to fetch datasets', { status: 500 })
  }
}
