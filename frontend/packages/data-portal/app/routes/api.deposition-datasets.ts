import { LoaderFunctionArgs } from '@remix-run/server-runtime'

import {
  getDatasetsForDepositionViaAnnotationShapes,
  getDatasetsForDepositionViaTomograms,
} from 'app/graphql/getDatasetsForDepositionV2.server'
import { DataContentsType } from 'app/types/deposition-queries'

interface DatasetOption {
  id: number
  title: string
  organismName: string | null
}

interface DepositionDatasetsResponse {
  datasets: DatasetOption[]
  organismCounts: Record<string, number>
  annotationCounts: Record<number, number>
  tomogramCounts: Record<number, number>
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionId = url.searchParams.get('depositionId')
  const type = url.searchParams.get('type')

  if (!depositionId || Number.isNaN(Number(depositionId))) {
    return new Response('Missing or invalid depositionId', { status: 400 })
  }

  if (
    !type ||
    !Object.values(DataContentsType).includes(type as DataContentsType)
  ) {
    return new Response(
      'Missing or invalid type parameter. Must be "annotations" or "tomograms"',
      { status: 400 },
    )
  }

  try {
    const depositionIdNum = Number(depositionId)
    const isAnnotationsType =
      (type as DataContentsType) === DataContentsType.Annotations

    // Transform data to DatasetOption[] and aggregate organism counts
    const datasets: DatasetOption[] = []
    const seenIds = new Set<number>()
    const organismCounts: Record<string, number> = {}
    const annotationCounts: Record<number, number> = {}
    const tomogramCounts: Record<number, number> = {}

    if (isAnnotationsType) {
      const { data } =
        await getDatasetsForDepositionViaAnnotationShapes(depositionIdNum)

      data.annotationShapesAggregate.aggregate?.forEach((item) => {
        const dataset = item.groupBy?.annotation?.run?.dataset
        const count = item.count || 0
        const organismName = dataset?.organismName

        // Aggregate counts by organism
        if (organismName && typeof organismName === 'string') {
          organismCounts[organismName] =
            (organismCounts[organismName] || 0) + count
        }

        // Collect unique datasets and aggregate counts by dataset
        if (
          dataset?.id &&
          dataset?.title &&
          typeof dataset.id === 'number' &&
          typeof dataset.title === 'string'
        ) {
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
    } else {
      const { data } =
        await getDatasetsForDepositionViaTomograms(depositionIdNum)

      data.tomogramsAggregate.aggregate?.forEach((item) => {
        const dataset = item.groupBy?.run?.dataset
        const count = item.count || 0
        const organismName = dataset?.organismName

        // Aggregate counts by organism
        if (organismName && typeof organismName === 'string') {
          organismCounts[organismName] =
            (organismCounts[organismName] || 0) + count
        }

        // Collect unique datasets and aggregate counts by dataset
        if (
          dataset?.id &&
          dataset?.title &&
          typeof dataset.id === 'number' &&
          typeof dataset.title === 'string'
        ) {
          if (!seenIds.has(dataset.id)) {
            datasets.push({
              id: dataset.id,
              title: dataset.title,
              organismName: dataset.organismName ?? null,
            })
            seenIds.add(dataset.id)
          }

          // Aggregate tomogram counts by dataset
          tomogramCounts[dataset.id] = (tomogramCounts[dataset.id] || 0) + count
        }
      })
    }

    // Sort datasets by title for consistent ordering
    const sortedDatasets = datasets.sort((a, b) =>
      a.title.localeCompare(b.title),
    )

    const response: DepositionDatasetsResponse = {
      datasets: sortedDatasets,
      organismCounts,
      annotationCounts,
      tomogramCounts,
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
