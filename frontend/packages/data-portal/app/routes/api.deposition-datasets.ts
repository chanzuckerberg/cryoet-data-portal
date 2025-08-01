import { LoaderFunctionArgs } from '@remix-run/server-runtime'

import {
  getDatasetsForDepositionViaAnnotationShapes,
  getDatasetsForDepositionViaTomograms,
} from 'app/graphql/getDatasetsForDepositionV2.server'
import { DataContentsType } from 'app/types/deposition-queries'
import { aggregateDatasetInfo } from 'app/utils/deposition-aggregation'

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

    let aggregationResult
    let annotationCounts: Record<number, number> = {}
    let tomogramCounts: Record<number, number> = {}

    if (isAnnotationsType) {
      const { data } =
        await getDatasetsForDepositionViaAnnotationShapes(depositionIdNum)

      aggregationResult = aggregateDatasetInfo(
        data.annotationShapesAggregate.aggregate || [],
        true, // isAnnotationType
      )
      annotationCounts = aggregationResult.counts
    } else {
      const { data } =
        await getDatasetsForDepositionViaTomograms(depositionIdNum)

      aggregationResult = aggregateDatasetInfo(
        data.tomogramsAggregate.aggregate || [],
        false, // isAnnotationType
      )
      tomogramCounts = aggregationResult.counts
    }

    const response: DepositionDatasetsResponse = {
      datasets: aggregationResult.datasets,
      organismCounts: aggregationResult.organismCounts,
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
