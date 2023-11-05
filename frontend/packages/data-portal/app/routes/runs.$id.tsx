/* eslint-disable @typescript-eslint/no-throw-literal */

import { useParams } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'

import { gql } from 'app/__generated__'
import { apolloClient } from 'app/apollo.server'
import { Demo } from 'app/components/Demo'
import { RunMetadataDrawer } from 'app/components/Run/RunMetadataDrawer'
import { useCloseDrawerOnUnmount, useDrawer } from 'app/state/drawer'

const GET_RUN_BY_ID_QUERY = gql(`
  query GetRunById($id: Int) {
    runs(where: {id: {_eq: $id}}) {
      name
      tiltseries {
        acceleration_voltage
        camera_manufacturer
        camera_model
        data_acquisition_software
        tilt_axis
        tilt_max
        tilt_min
        tilt_range
        tilt_series_quality
        tilt_step
        tilting_scheme
        total_flux
        microscope_additional_info
        microscope_energy_filter
        microscope_image_corrector
        microscope_manufacturer
        microscope_model
        microscope_phase_plate
        related_empiar_entry
        spherical_aberration_constant
        id
        binning_from_frames
      }

      dataset {
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
    query: GET_RUN_BY_ID_QUERY,
    variables: {
      id: +id,
    },
  })

  if (data.runs.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Run with ID ${id} not found`,
    })
  }

  return json(data)
}

export default function RunByIdPage() {
  const params = useParams()
  const drawer = useDrawer()
  useCloseDrawerOnUnmount()

  return (
    <>
      <Demo>
        <div className="flex flex-col gap-sds-xl">
          <span className="text-5xl">Run Page ID = {params.id}</span>

          <button onClick={drawer.toggle} type="button">
            Toggle Drawer
          </button>
        </div>
      </Demo>
      <RunMetadataDrawer />
    </>
  )
}
