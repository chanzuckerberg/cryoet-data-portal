import { useTypedLoaderData } from 'remix-typedjson'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export function useRunById() {
  const {
    data: {
      runs: [run],
    },
    fileSizeMap,
  } = useTypedLoaderData<{
    data: GetRunByIdQuery
    fileSizeMap: Record<string, number>
  }>()

  return { run, fileSizeMap }
}
