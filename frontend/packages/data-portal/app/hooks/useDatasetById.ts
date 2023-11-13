import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'

export function useDatasetById() {
  const {
    datasets: [dataset],
  } = useTypedLoaderData<GetDatasetByIdQuery>()

  return { dataset }
}
