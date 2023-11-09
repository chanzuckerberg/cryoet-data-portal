import { useLoaderData } from '@remix-run/react'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export function useRunById() {
  const {
    runs: [run],
  } = useLoaderData<GetRunByIdQuery>()

  return { run }
}
