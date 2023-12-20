import { pick } from 'lodash-es'

import { getPlausibleUrl } from 'app/hooks/usePlausible'

export async function loader() {
  const plausibleUrl = getPlausibleUrl({
    hasLocalhostTracking: process.env.LOCALHOST_PLAUSIBLE_TRACKING === 'true',
  })

  const response = await fetch(plausibleUrl)
  const script = await response.text()
  const { status, headers } = response

  return new Response(script, {
    status,
    headers: pick(headers, [
      'cache-control',
      'content-encoding',
      'content-type',
    ]) as Record<string, string>,
  })
}
