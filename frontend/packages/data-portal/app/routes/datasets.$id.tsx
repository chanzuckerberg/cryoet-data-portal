/* eslint-disable @typescript-eslint/no-throw-literal */

import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

import { gql } from 'app/__generated__'
import { apolloClient } from 'app/apollo.server'
import { DatasetMetadataDrawer } from 'app/components/Dataset'
import { DatasetHeader } from 'app/components/Dataset/DatasetHeader'
import { RunsTable } from 'app/components/Dataset/RunsTable'
import { DownloadModal } from 'app/components/Download'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { QueryParams } from 'app/constants/query'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'
import { shouldRevalidatePage } from 'app/utils/revalidate'

const GET_DATASET_BY_ID = gql(`
  query GetDatasetById($id: Int, $run_limit: Int, $run_offset: Int) {
    datasets(where: { id: { _eq: $id } }) {
      s3_prefix

      # key photo
      key_photo_url

      # Dataset dates
      last_modified_date
      release_date
      deposition_date

      # Dataset metadata
      id
      title
      description

      funding_sources {
        funding_agency_name
        grant_id
      }

      related_database_entries
      dataset_citations

      # Sample and experiments data
      cell_component_name
      cell_component_id
      cell_name
      cell_strain_name
      cell_strain_id
      cell_type_id
      grid_preparation
      organism_name
      organism_taxid
      other_setup
      sample_preparation
      sample_type
      tissue_name
      tissue_id
      authors(
        order_by: {
          author_list_order: asc,
        },
      ) {
        name
        email
        primary_author_status
        corresponding_author_status
      }

      authors_with_affiliation: authors(where: {affiliation_name: {_is_null: false}}) {
        name
        affiliation_name
      }

      # publication info
      related_database_entries
      dataset_publications

      # Tilt Series
      run_metadata: runs(limit: 1) {
        tiltseries(limit: 1) {
          acceleration_voltage
          spherical_aberration_constant
          microscope_manufacturer
          microscope_model
          microscope_energy_filter
          microscope_phase_plate
          microscope_image_corrector
          microscope_additional_info
          camera_manufacturer
          camera_model
        }
      }

      runs(limit: $run_limit, offset: $run_offset) {
        id
        name

        tiltseries_aggregate {
          aggregate {
            avg {
              tilt_series_quality
            }
          }
        }

        tomogram_voxel_spacings {
          annotations(distinct_on: object_name) {
            object_name
          }

          tomograms(limit: 1) {
            id
            key_photo_thumbnail_url
            neuroglancer_config
          }
        }
      }

      runs_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`)

export async function loader({ params, request }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  const url = new URL(request.url)
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')

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
      run_limit: MAX_PER_PAGE,
      run_offset: (page - 1) * MAX_PER_PAGE,
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

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage(args)
}

export default function DatasetByIdPage() {
  const { dataset } = useDatasetById()

  return (
    <TablePageLayout
      type={i18n.runs}
      downloadModal={
        <DownloadModal
          datasetId={dataset.id}
          datasetTitle={dataset.title}
          s3DatasetPrefix={dataset.s3_prefix}
          type="dataset"
        />
      }
      drawers={<DatasetMetadataDrawer />}
      // TODO add filter count when filters are added
      filteredCount={dataset.runs_aggregate.aggregate?.count ?? 0}
      header={<DatasetHeader />}
      table={<RunsTable />}
      totalCount={dataset.runs_aggregate.aggregate?.count ?? 0}
    />
  )
}
