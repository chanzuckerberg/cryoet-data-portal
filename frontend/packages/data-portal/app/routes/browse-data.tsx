import { Outlet } from '@remix-run/react'
import { json } from '@remix-run/server-runtime'
import { useEffect } from 'react'

import { gql } from 'app/__generated_v2__'
import { apolloClientV2 } from 'app/apollo.server'
import { BrowseDataHeader } from 'app/components/BrowseData'
import { useDepositionHistory } from 'app/state/filterHistory'

const GET_TOOLBAR_DATA_QUERY = gql(`
  query GetToolbarData {
    datasetsAggregate {
      aggregate {
        count
      }
    }

    depositionsAggregate(where: { depositionTypes: { type: { _eq: annotation }}}) {
      aggregate {
        count
      }
    }
  }
`)

export async function loader() {
  const { data } = await apolloClientV2.query({
    query: GET_TOOLBAR_DATA_QUERY,
  })

  return json(data)
}

export function shouldRevalidate() {
  // Data is static so we don't have to refetch every time.
  return false
}

export default function BrowseDataPage() {
  const { setPreviousDepositionId } = useDepositionHistory()
  useEffect(() => setPreviousDepositionId(null), [setPreviousDepositionId])

  return (
    <div className="flex flex-col flex-auto">
      <BrowseDataHeader />
      <Outlet />
    </div>
  )
}
