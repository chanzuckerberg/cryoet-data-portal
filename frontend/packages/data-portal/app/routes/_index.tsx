import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/server-runtime'

import { gql } from 'app/__generated__'
import { apolloClient } from 'app/apollo.server'
import { IndexContent, IndexHeader } from 'app/components/Index'

const LANDING_PAGE_DATA_QUERY = gql(`
  query LandingPageData {
    datasets_aggregate {
      aggregate {
        count(distinct: true)
      }
    }
    species_aggregate: datasets_aggregate {
      aggregate {
        count(distinct: true, columns: organism_taxid)
      }
    }
    tomograms_aggregate {
      aggregate {
        count(distinct: true)
      }
    }
  }
`)

export async function loader() {
  const { data } = await apolloClient.query({
    query: LANDING_PAGE_DATA_QUERY,
  })

  return json(data)
}

export const meta: MetaFunction = () => {
  return [
    {
      title: 'CryoET Data Portal',
      description: 'Welcome to the CryoET Data Portal!',
    },
  ]
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <p>yoooo</p>
      <IndexHeader />
      <IndexContent />
    </div>
  )
}
