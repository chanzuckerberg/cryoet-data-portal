import { ActionFunctionArgs } from '@remix-run/server-runtime'

export async function action({ request }: ActionFunctionArgs) {
  const response = await fetch('https://plausible.io/api/event', {
    body: request.body,
    method: request.method,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const responseBody = await response.text()
  const { status, headers } = response

  return new Response(responseBody, {
    status,
    headers,
  })
}
