/* eslint-disable @typescript-eslint/no-throw-literal */

import { Icon } from '@czi-sds/components'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

import { gql } from 'app/__generated__'
import { GetDatasetByIdQuery } from 'app/__generated__/graphql'
import { apolloClient } from 'app/apollo.server'
import { Demo } from 'app/components/Demo'
import { Link } from 'app/components/Link'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

const GET_DATASET_BY_ID = gql(`
  query GetDatasetById($id: Int) {
    datasets(where: { id: { _eq: $id } }) {
      id
      last_modified_date
      release_date
    }
  }
`)

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const { data } = await apolloClient.query({
    query: GET_DATASET_BY_ID,
    variables: {
      id: +id,
    },
  })

  if (data.datasets.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Dataset with ID ${id} not found`,
    })
  }

  return json(data)
}

export default function DatasetByIdPage() {
  const [params] = useSearchParams()
  const previousUrl = params.get('prev')

  const {
    datasets: [dataset],
  } = useLoaderData<GetDatasetByIdQuery>()

  return (
    <>
      <header className="flex flex-col items-center justify-center w-full min-h-[48px]">
        <div
          className={cns(
            'flex items-center',
            'px-sds-xl py-sds-l',
            'w-full max-w-content',
            previousUrl ? 'justify-between' : 'justify-end',
          )}
        >
          {previousUrl && (
            <Link className="flex items-center gap-1" to={previousUrl}>
              <Icon
                sdsIcon="chevronLeft"
                sdsSize="xs"
                sdsType="iconButton"
                className="!w-[10px] !h-[10px] !fill-sds-primary-400"
              />
              <span className="text-sds-primary-400 font-semibold text-sm">
                Back to results
              </span>
            </Link>
          )}

          <div className="flex items-center gap-sds-xs text-xs text-sds-gray-600">
            <p>{i18n.releaseDate(dataset.release_date)}</p>
            <div className="h-3 w-px bg-sds-gray-400" />
            <p>{i18n.lastModified(dataset.last_modified_date ?? '--')}</p>
          </div>
        </div>
      </header>

      <Demo>Dataset {dataset.id}</Demo>
    </>
  )
}
