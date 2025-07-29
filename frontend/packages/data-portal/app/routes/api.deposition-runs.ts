import { LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClientV2 } from 'app/apollo.server'
import {
  getDepositionAnnoRunsForDataset,
  getDepositionTomoRunsForDataset,
} from 'app/graphql/getDepositionRunsV2.server'
import { DataContentsType } from 'app/types/deposition-queries'
import {
  createJsonResponse,
  handleApiError,
  validateNumericParam,
} from 'app/utils/api-helpers'
import { validateDepositionTab } from 'app/utils/param-parsers'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionIdParam = url.searchParams.get('depositionId')
  const datasetIdParam = url.searchParams.get('datasetId')
  const pageParam = url.searchParams.get('page')
  const typeParam = url.searchParams.get('type')

  try {
    const depositionId = validateNumericParam(depositionIdParam, 'depositionId')
    const datasetId = validateNumericParam(datasetIdParam, 'datasetId')
    const page = validateNumericParam(pageParam, 'page')
    const type: DataContentsType = validateDepositionTab(typeParam)

    let result
    switch (type) {
      case DataContentsType.Annotations:
        result = await getDepositionAnnoRunsForDataset({
          client: apolloClientV2,
          depositionId,
          datasetId,
          page,
        })
        break
      case DataContentsType.Tomograms:
        result = await getDepositionTomoRunsForDataset({
          client: apolloClientV2,
          depositionId,
          datasetId,
          page,
        })
        break
      default:
        throw new Error('Unsupported type provided')
    }

    return createJsonResponse(result.data)
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 })
    }
    return handleApiError(error, 'fetch deposition runs')
  }
}
