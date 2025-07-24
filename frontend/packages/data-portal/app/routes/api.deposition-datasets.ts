import { LoaderFunctionArgs } from '@remix-run/server-runtime'

import { getDatasetsForDepositionViaAnnotationShapes } from 'app/graphql/getDatasetsForDepositionV2.server'

interface DatasetOption {
  id: number
  title: string
  organismName: string | null
}

interface DepositionDatasetsResponse {
  datasets: DatasetOption[]
  organismCounts: Record<string, number>
  annotationCounts: Record<number, number>
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

    // Transform data to DatasetOption[] and aggregate organism counts
    const datasets: DatasetOption[] = []
    const seenIds = new Set<number>()
    const organismCounts: Record<string, number> = {}
    const annotationCounts: Record<number, number> = {}

    data.annotationShapesAggregate.aggregate?.forEach((item) => {
      const dataset = item.groupBy?.annotation?.run?.dataset
      const count = item.count || 0
      const organismName = dataset?.organismName

      // Aggregate annotation counts by organism
      if (organismName) {
        organismCounts[organismName] =
          (organismCounts[organismName] || 0) + count
      }

      // Collect unique datasets and aggregate annotation counts by dataset
      if (dataset?.id && dataset?.title) {
        if (!seenIds.has(dataset.id)) {
          datasets.push({
            id: dataset.id,
            title: dataset.title,
            organismName: dataset.organismName ?? null,
          })
          seenIds.add(dataset.id)
        }

        // Aggregate annotation counts by dataset
        annotationCounts[dataset.id] =
          (annotationCounts[dataset.id] || 0) + count
      }
    })

    // Sort datasets by title for consistent ordering
    const sortedDatasets = datasets.sort((a, b) =>
      a.title.localeCompare(b.title),
    )

    const response: DepositionDatasetsResponse = {
      datasets: sortedDatasets,
      organismCounts,
      annotationCounts,
    }

    return new Response(JSON.stringify(response), {
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
