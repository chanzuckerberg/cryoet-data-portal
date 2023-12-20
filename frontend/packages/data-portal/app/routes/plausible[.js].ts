import { pick } from 'lodash-es'

import { PLAUSIBLE_URL } from 'app/hooks/usePlausible'

export async function loader() {
  const response = await fetch(PLAUSIBLE_URL)
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
