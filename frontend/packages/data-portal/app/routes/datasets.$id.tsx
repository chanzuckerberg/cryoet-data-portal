/* eslint-disable @typescript-eslint/no-throw-literal */

import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

import { gql } from 'app/__generated__'
import { apolloClient } from 'app/apollo.server'
import { DatasetMetadataDrawer } from 'app/components/Dataset'
import { DatasetHeader } from 'app/components/Dataset/DatasetHeader'
import { Demo } from 'app/components/Demo'
import { useCloseDatasetDrawerOnUnmount } from 'app/state/drawer'

const GET_DATASET_BY_ID = gql(`
  query GetDatasetById($id: Int) {
    datasets(where: { id: { _eq: $id } }) {
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
      }

      # TODO Grant ID
      related_database_entries
      dataset_citations

      # Sample and experiments data
      sample_type
      organism_name
      tissue_name
      cell_name
      cell_strain_name
      # TODO cellular component
      sample_preparation
      grid_preparation
      other_setup

      authors(distinct_on: name) {
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
      runs(limit: 1) {
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
  useCloseDatasetDrawerOnUnmount()

  return (
    <>
      <div className="mx-sds-xl max-w-content">
        <DatasetHeader />

        <Demo>Nothing Here</Demo>
      </div>

      <DatasetMetadataDrawer />
    </>
  )
}
