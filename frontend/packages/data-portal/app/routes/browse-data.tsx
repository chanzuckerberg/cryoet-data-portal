import { Outlet } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import { useEffect } from 'react'

import { gql } from 'app/__generated_v2__'
import { Deposition_Types_Enum } from 'app/__generated_v2__/graphql'
import { apolloClientV2 } from 'app/apollo.server'
import { BrowseDataHeader } from 'app/components/BrowseData'
import { useDepositionHistory } from 'app/state/filterHistory'
import { getFeatureFlag } from 'app/utils/featureFlags'

const GET_TOOLBAR_DATA_QUERY = gql(`
  query GetToolbarData($depositionFilter: DepositionWhereClause) {
    datasetsAggregate {
      aggregate {
        count
      }
    }

    depositionsAggregate(where: $depositionFilter) {
      aggregate {
        count
      }
    }
  }
`)

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)

  const isExpandDepositions = getFeatureFlag({
    env: process.env.ENV,
    key: 'expandDepositions',
    params: url.searchParams,
  })

  // Determine the filter based on feature flag
  const depositionFilter = isExpandDepositions
    ? null // No filter - query all deposition types
    : { depositionTypes: { type: { _eq: Deposition_Types_Enum.Annotation } } } // Filter for annotation types only

  const { data } = await apolloClientV2.query({
    query: GET_TOOLBAR_DATA_QUERY,
    variables: {
      depositionFilter,
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
