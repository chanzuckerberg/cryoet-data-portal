import { Outlet } from '@remix-run/react'
import { json } from '@remix-run/server-runtime'
import { useEffect } from 'react'

import { gql } from 'app/__generated__'
import { apolloClient } from 'app/apollo.server'
import { BrowseDataHeader } from 'app/components/BrowseData'
import { depositionWithAnnotationFilter } from 'app/graphql/common'
import { useDepositionHistory } from 'app/state/filterHistory'

const GET_TOOLBAR_DATA_QUERY = gql(`
  query GetToolbarData($deposition_type_filter: depositions_bool_exp) {
    datasets_aggregate {
      aggregate {
        count
      }
    }

    depositions_aggregate(where: $deposition_type_filter) {
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
    variables: {
      deposition_type_filter: depositionWithAnnotationFilter,
    },
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
