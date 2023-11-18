import { CellHeaderDirection } from '@czi-sds/components'
import { json, LoaderFunctionArgs } from '@remix-run/node'

import { gql } from 'app/__generated__'
import { Order_By } from 'app/__generated__/graphql'
import { apolloClient } from 'app/apollo.server'
import { DatasetTable } from 'app/components/BrowseData'
import { FilterPanel } from 'app/components/FilterPanel'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { useDatasets } from 'app/hooks/useDatasets'

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

    filtered_datasets_aggregate: datasets_aggregate(where: $filter) {
      aggregate {
        count
      }
    }

    organism_names: datasets(distinct_on:organism_name) {
      organism_name
    }

    camera_manufacturers: tiltseries(distinct_on: camera_manufacturer) {
      camera_manufacturer
    }

    reconstruction_methods: tomograms(distinct_on: reconstruction_method) {
      reconstruction_method
    }

    reconstruction_softwares:tomograms(distinct_on: reconstruction_software) {
      reconstruction_software
    }

    object_names: annotations(distinct_on: object_name) {
      object_name
    }

    object_shape_types: annotations(distinct_on: shape_type) {
      shape_type
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
  const { datasetCount, filteredDatasetCount } = useDatasets()

  return (
    <TablePageLayout
      filteredCount={filteredDatasetCount}
      filterPanel={<FilterPanel />}
      table={<DatasetTable />}
      totalCount={datasetCount}
    />
  )
}
