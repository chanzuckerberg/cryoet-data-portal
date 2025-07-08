import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/server-runtime'

import { gql } from 'app/__generated_v2__'
import { apolloClientV2 } from 'app/apollo.server'
import { IndexContent, IndexHeader } from 'app/components/Index'

const LANDING_PAGE_DATA_QUERY = gql(`
  query LandingPageData {
    datasetsAggregate {
      aggregate {
        count
      }
    }
    distinctSpecies: datasetsAggregate {
      aggregate {
        count(columns: organismTaxid, distinct: true)
      }
    }
    tomogramsAggregate {
      aggregate {
        count
      }
    }
  }
`)

export async function loader() {
  const { data } = await apolloClientV2.query({
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
      <p>hello, world!</p>
      <IndexHeader />
      <IndexContent />
    </div>
  )
}
