import { ActionFunctionArgs } from '@remix-run/server-runtime'

import { LogApiRequestBody } from 'app/types/logging'

export async function action({ request }: ActionFunctionArgs) {
  const { logs } = (await request.json()) as LogApiRequestBody

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, no-console
  logs.forEach((entry) => console[entry.level](...entry.messages))

  return 'OK'
}
