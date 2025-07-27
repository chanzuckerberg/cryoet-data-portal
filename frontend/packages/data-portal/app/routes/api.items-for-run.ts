import { LoaderFunctionArgs } from '@remix-run/server-runtime'

import { apolloClientV2 } from 'app/apollo.server'
import {
  getAnnotationsForRunAndDeposition,
  getTomogramsForRunAndDeposition,
} from 'app/graphql/getDepositionRunsV2.server'
import { DepositionTab } from 'app/hooks/useDepositionTab'
import {
  createJsonResponse,
  handleApiError,
  validateNumericParam,
} from 'app/utils/api-helpers'
import { validateDepositionTab } from 'app/utils/param-parsers'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const depositionIdParam = url.searchParams.get('depositionId')
  const runIdParam = url.searchParams.get('runId')
  const pageParam = url.searchParams.get('page')
  const typeParam = url.searchParams.get('type')

  try {
    const depositionId = validateNumericParam(depositionIdParam, 'depositionId')
    const runId = validateNumericParam(runIdParam, 'runId')
    const page = validateNumericParam(pageParam, 'page')
    const type = validateDepositionTab(typeParam)

    let result
    if (type === DepositionTab.Annotations) {
      result = await getAnnotationsForRunAndDeposition({
        client: apolloClientV2,
        depositionId,
        runId,
        page,
      })
    } else {
      result = await getTomogramsForRunAndDeposition({
        client: apolloClientV2,
        depositionId,
        runId,
        page,
      })
    }

    return createJsonResponse(result.data)
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 400 })
    }
    return handleApiError(
      error,
      `fetch ${typeParam || 'items'} for run and deposition`,
    )
  }
}
