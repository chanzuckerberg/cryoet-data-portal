import { useLoaderData } from '@remix-run/react'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'

export function useDatasetById() {
  const {
    datasets: [dataset],
    dataset_authors: authors,
  } = useLoaderData<GetDatasetByIdQuery>()

  return { dataset, authors }
}
