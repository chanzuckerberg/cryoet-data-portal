import { CellHeaderDirection, Pagination } from '@czi-sds/components'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useSearchParams } from '@remix-run/react'

import { gql } from 'app/__generated__'
import { GetDatasetsDataQuery, Order_By } from 'app/__generated__/graphql'
import { apolloClient } from 'app/apollo.server'
import {
  BrowseDataFilterCount,
  DatasetTable,
  FilterPanel,
} from 'app/components/BrowseData'
import { MAX_PER_PAGE } from 'app/constants/pagination'

const GET_DATASETS_DATA_QUERY = gql(`
  query GetDatasetsData(
    $limit: Int,
    $offset: Int,
    $order_by_dataset: order_by,
    $query: String,
  ) {
    datasets(
      limit: $limit,
      offset: $offset,
      order_by: { title: $order_by_dataset },
      where: {
        title: { _ilike: $query },
      },
    ) {
      id
      title
      organism_name
      dataset_publications

      authors {
        name
        primary_author_status
      }

      runs_aggregate {
        aggregate {
          count
        }
      }
    }

    datasets_aggregate {
      aggregate {
        count
      }
    }

    filtered_datasets_aggregate: datasets_aggregate(
      where: {
        title: { _ilike: $query },
      },
    ) {
      aggregate {
        count
      }
    }
  }
`)

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const page = +(url.searchParams.get('page') ?? '1')
  const sort = (url.searchParams.get('sort') ?? undefined) as
    | CellHeaderDirection
    | undefined
  const search = url.searchParams.get('search') ?? ''

  let orderBy: Order_By | null = null

  if (sort) {
    orderBy = sort === 'asc' ? Order_By.Asc : Order_By.Desc
  }

  const { data } = await apolloClient.query({
    query: GET_DATASETS_DATA_QUERY,
    variables: {
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
      order_by_dataset: orderBy,
      query: `%${search}%`,
    },
  })

  return json(data)
}

export default function BrowseDatasetsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = +(searchParams.get('page') ?? '1')
  const data = useLoaderData<GetDatasetsDataQuery>()

  function setPage(nextPage: number) {
    setSearchParams((prev) => {
      prev.set('page', `${nextPage}`)
      return prev
    })
  }

  return (
    <div className="flex flex-auto">
      <FilterPanel />

      <div className="flex flex-col flex-auto items-center gap-sds-xxl py-sds-xl px-sds-xl">
        <BrowseDataFilterCount />
        <DatasetTable />

        <div className="w-full flex justify-center">
          <Pagination
            currentPage={page}
            pageSize={MAX_PER_PAGE}
            totalCount={data.datasets_aggregate.aggregate?.count ?? 0}
            onNextPage={() => setPage(page + 1)}
            onPreviousPage={() => setPage(page - 1)}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        </div>
      </div>
    </div>
  )
}
