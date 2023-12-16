import { ActionFunctionArgs } from '@remix-run/server-runtime'

import { ServerContext } from 'app/types/context'
import { removeNullishValues } from 'app/utils/object'

export async function action({ request, context }: ActionFunctionArgs) {
  const { clientIp } = context as ServerContext

  const payload = {
    body: request.body,
    method: request.method,
    headers: removeNullishValues({
      'Content-Type': 'application/json',
      'user-agent': request.headers.get('user-agent'),
      'X-Forwarded-For': clientIp,
    }) as HeadersInit,
  }

  // eslint-disable-next-line no-console
  console.log({
    message: 'Sending plausible event',
    payload,
  })

  const response = await fetch('https://plausible.io/api/event', payload)
  const responseBody = await response.text()
  const { status, headers } = response

  return new Response(responseBody, {
    status,
    headers,
  })
}
