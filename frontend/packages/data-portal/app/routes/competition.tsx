import { LoaderFunctionArgs, redirect } from '@remix-run/server-runtime'

import { MLChallenge } from 'app/components/MLChallenge'
import { getFeatureFlag } from 'app/utils/featureFlags'

export function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const showMlChallenge = getFeatureFlag({
    env: process.env.ENV,
    key: 'mlChallenge',
    params: url.searchParams,
  })

  if (!showMlChallenge) {
    return redirect('/404')
  }

  return null
}

export default function CompetitionPage() {
  return <MLChallenge />
}
