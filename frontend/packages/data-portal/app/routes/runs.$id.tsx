/* eslint-disable @typescript-eslint/no-throw-literal */

import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import { AxiosResponse } from 'axios'
import { isNumber, sum } from 'lodash-es'

import { gql } from 'app/__generated__'
import { apolloClient } from 'app/apollo.server'
import { axios } from 'app/axios'
import { DownloadModal } from 'app/components/Download'
import { RunHeader } from 'app/components/Run'
import { AnnotationDrawer } from 'app/components/Run/AnnotationDrawer'
import { AnnotationTable } from 'app/components/Run/AnnotationTable'
import { RunMetadataDrawer } from 'app/components/Run/RunMetadataDrawer'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { MAX_PER_PAGE } from 'app/constants/pagination'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useRunById } from 'app/hooks/useRunById'
import { DownloadConfig } from 'app/types/download'

const GET_RUN_BY_ID_QUERY = gql(`
  query GetRunById($id: Int, $limit: Int, $offset: Int) {
    runs(where: { id: { _eq: $id } }) {
      id
      name

      tiltseries {
        acceleration_voltage
        binning_from_frames
        camera_manufacturer
        camera_model
        data_acquisition_software
        id
        microscope_additional_info
        microscope_energy_filter
        microscope_image_corrector
        microscope_manufacturer
        microscope_model
        microscope_phase_plate
        related_empiar_entry
        spherical_aberration_constant
        tilt_axis
        tilt_max
        tilt_min
        tilt_range
        tilt_series_quality
        tilt_step
        tilting_scheme
        total_flux
      }

      dataset {
        cell_name
        cell_strain_name
        dataset_citations
        dataset_publications
        deposition_date
        description
        grid_preparation
        id
        last_modified_date
        organism_name
        other_setup
        related_database_entries
        related_database_entries
        release_date
        s3_prefix
        sample_preparation
        sample_type
        tissue_name
        title

        authors(distinct_on: name) {
          name
          email
          primary_author_status
          corresponding_author_status
        }

        authors_with_affiliation: authors(where: { affiliation_name: { _is_null: false } }) {
          name
          affiliation_name
        }

        funding_sources {
          funding_agency_name
        }
      }

      tomogram_voxel_spacings(limit: 1) {
        id
        s3_prefix

        tomograms(limit: 1) {
          ctf_corrected
          fiducial_alignment_status
          name
          neuroglancer_config
          processing
          processing_software
          reconstruction_method
          reconstruction_software
          size_x
          size_y
          size_z
          voxel_spacing
        }
      }

      annotation_table: tomogram_voxel_spacings {
        annotations(limit: $limit, offset: $offset) {
          annotation_method
          annotation_publication
          annotation_software
          confidence_precision
          confidence_recall
          deposition_date
          ground_truth_status
          ground_truth_used
          last_modified_date
          object_count
          object_description
          object_name
          object_state
          release_date

          files {
            https_path
            s3_path
            shape_type
          }

          authors(order_by: { primary_annotator_status: desc }) {
            name
            primary_annotator_status
          }

          author_affiliations: authors(distinct_on: affiliation_name) {
            affiliation_name
          }

          authors_aggregate {
            aggregate {
              count
            }
          }
        }
      }

      tomogram_stats: tomogram_voxel_spacings {
        annotations(distinct_on: object_name) {
          object_name
        }

        annotations_aggregate {
          aggregate {
            count
          }
        }

        tomogram_processing: tomograms(distinct_on: processing) {
          processing
        }

        tomogram_resolutions: tomograms(distinct_on: voxel_spacing) {
          https_mrc_scale0
          id
          processing
          s3_mrc_scale0
          size_x
          size_y
          size_z
          voxel_spacing
        }

        tomograms_aggregate {
          aggregate {
            count
          }
        }
      }

      tiltseries_aggregate {
        aggregate {
          count
          avg {
            tilt_series_quality
          }
        }
      }
    }
  }
`)

export async function loader({ request, params }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const url = new URL(request.url)
  const page = +(url.searchParams.get('page') ?? '1')

  const { data } = await apolloClient.query({
    query: GET_RUN_BY_ID_QUERY,
    variables: {
      id: +id,
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
    },
  })

  if (data.runs.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Run with ID ${id} not found`,
    })
  }

  const fileSizeMap: Record<string, number> = {}

  // TODO Remove when file size is provided by DB
  await Promise.allSettled(
    Array.from(
      new Set(
        data.runs.flatMap((run) =>
          run.tomogram_stats.flatMap((stats) =>
            stats.tomogram_resolutions.flatMap(
              (tomogram) => tomogram.https_mrc_scale0,
            ),
          ),
        ),
      ),
    ).map(async (httpsPath) => {
      // TypeScript throws error without type cast
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const res = (await axios.head(httpsPath)) as AxiosResponse
      const contentLength = res.headers['content-length'] as string | null
      if (contentLength && isNumber(+contentLength)) {
        fileSizeMap[httpsPath] = +contentLength
      }
    }),
  )

  return json({
    data,
    fileSizeMap,
  })
}

export default function RunByIdPage() {
  const { run, fileSizeMap } = useRunById()

  const totalCount = sum(
    run.tomogram_stats.flatMap(
      (stats) => stats.annotations_aggregate.aggregate?.count ?? 0,
    ),
  )

  const allTomogramResolutions = run.tomogram_stats.flatMap((stats) =>
    stats.tomogram_resolutions.map((tomogram) => tomogram),
  )

  const allTomogramProcessing = run.tomogram_stats.flatMap((stats) =>
    stats.tomogram_processing.map((tomogram) => tomogram.processing),
  )

  const { downloadConfig, tomogramProcessing, tomogramSampling } =
    useDownloadModalQueryParamState()

  const activeTomogram =
    (downloadConfig === DownloadConfig.Tomogram &&
      allTomogramResolutions.find(
        (tomogram) =>
          `${tomogram.voxel_spacing}` === tomogramSampling &&
          tomogram.processing === tomogramProcessing,
      )) ||
    null

  const fileSize =
    activeTomogram && fileSizeMap[activeTomogram.https_mrc_scale0]

  return (
    <TablePageLayout
      downloadModal={
        <DownloadModal
          allTomogramProcessing={allTomogramProcessing}
          allTomogramResolutions={allTomogramResolutions}
          datasetId={run.dataset.id}
          fileSize={fileSize ?? undefined}
          httpsPath={activeTomogram?.https_mrc_scale0 ?? undefined}
          runName={run.name}
          s3DatasetPrefix={run.dataset.s3_prefix}
          s3TomogramVoxelPrefix={
            run.tomogram_voxel_spacings.at(0)?.s3_prefix ?? undefined
          }
          s3TomogramPrefix={activeTomogram?.s3_mrc_scale0 ?? undefined}
          showAllAnnotations={downloadConfig === DownloadConfig.AllAnnotations}
          tomogramId={activeTomogram?.id ?? undefined}
          tomogramVoxelId={run.tomogram_voxel_spacings.at(0)?.id ?? undefined}
          type="runs"
        />
      }
      drawers={
        <>
          <RunMetadataDrawer />
          <AnnotationDrawer />
        </>
      }
      filteredCount={totalCount}
      header={<RunHeader />}
      table={<AnnotationTable />}
      totalCount={totalCount}
    />
  )
}
