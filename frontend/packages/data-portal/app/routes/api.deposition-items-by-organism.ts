import type { LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClientV2 } from 'app/apollo.server'
import { MAX_PER_FULLY_OPEN_ACCORDION } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { getDepositionAnnotations } from 'app/graphql/getDepositionAnnotationsV2.server'
import { getDepositionTomograms } from 'app/graphql/getDepositionTomogramsV2.server'
import { DataContentsType } from 'app/types/deposition-queries'
import {
  createJsonResponse,
  handleApiError,
  validateNumericParam,
} from 'app/utils/api-helpers'
import { parsePageParams } from 'app/utils/param-parsers'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionIdParam = url.searchParams.get('depositionId')
  const organismName = url.searchParams.get('organismName')
  const type = url.searchParams.get('type') as DataContentsType
  const pageParam = url.searchParams.get('page') || '1'
  const pageSizeParam =
    url.searchParams.get('pageSize') || String(MAX_PER_FULLY_OPEN_ACCORDION)
  const datasetIds = url.searchParams.getAll('dataset_id')

  try {
    const depositionId = validateNumericParam(depositionIdParam, 'depositionId')

    if (!organismName) {
      throw new Error('Missing organismName')
    }

    if (!type || !Object.values(DataContentsType).includes(type)) {
      throw new Error(
        `Missing or invalid type parameter. Must be "${DataContentsType.Annotations}" or "${DataContentsType.Tomograms}"`,
      )
    }

    const { page, pageSize } = parsePageParams(pageParam, pageSizeParam)

    // Create URL search params with organism filter and dataset IDs
    const params = new URLSearchParams()
    params.set(QueryParams.Organism, organismName)

    // Add dataset IDs to params if they exist
    datasetIds.forEach((datasetId) => {
      params.append(QueryParams.DatasetId, datasetId)
    })

    if (type === DataContentsType.Annotations) {
      const { data } = await getDepositionAnnotations({
        client: apolloClientV2,
        depositionId,
        page,
        pageSize,
        params,
      })

      const annotations = data.annotationShapes || []
      return createJsonResponse({ annotations })
    }

    if (type === DataContentsType.Tomograms) {
      const { data } = await getDepositionTomograms({
        client: apolloClientV2,
        depositionId,
        page,
        pageSize,
        params,
      })

      const tomograms = data.tomograms || []
      return createJsonResponse({ tomograms })
    }

    // This should never be reached due to validation above
    throw new Error('Invalid type parameter')
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 })
    }
    return handleApiError(error, `fetch ${type || 'items'} by organism`)
  }
}
