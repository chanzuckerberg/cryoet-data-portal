import { useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/server-runtime'
import { useEffect } from 'react'

import { gql } from 'app/__generated__'
import { apolloClient } from 'app/apollo.server'
import { Demo } from 'app/components/Demo'

const GET_ALL_DATASETS_QUERY = gql(`
  query GetDatasets {
    datasets {
      authors {
        name
      }
    }
  }
`)

export async function loader() {
  const { data } = await apolloClient.query({
    query: GET_ALL_DATASETS_QUERY,
  })

  return json(data.datasets)
}

export default function AllDatasetsPage() {
  const data = useLoaderData<typeof loader>()

  useEffect(() => {
    console.log('dataset authors', data)
  }, [data])

  return <Demo>All Datasets Page</Demo>
}
