import { useTypedLoaderData } from 'remix-typedjson'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export function useRunById() {
  const {
    runs: [run],
  } = useTypedLoaderData<GetRunByIdQuery>()

  return { run }
}
