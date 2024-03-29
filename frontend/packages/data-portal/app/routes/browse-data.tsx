import { Outlet } from '@remix-run/react'
import { json } from '@remix-run/server-runtime'

import { gql } from 'app/__generated__'
import { apolloClient } from 'app/apollo.server'
import { BrowseDataHeader } from 'app/components/BrowseData'

const GET_TOOLBAR_DATA_QUERY = gql(`
  query GetToolbarData {
    datasets_aggregate {
      aggregate {
        count
      }
    }

    runs_aggregate {
      aggregate {
        count
      }
    }
  }
`)

export async function loader() {
  const { data } = await apolloClient.query({
    query: GET_TOOLBAR_DATA_QUERY,
  })

  return json(data)
}

export function shouldRevalidate() {
  // Data is static so we don't have to refetch every time.
  return false
}

export default function BrowseDataPage() {
  return (
    <div className="flex flex-col flex-auto">
      <BrowseDataHeader />
      <Outlet />
    </div>
  )
}
