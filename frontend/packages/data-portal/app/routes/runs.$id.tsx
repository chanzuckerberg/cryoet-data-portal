/* eslint-disable @typescript-eslint/no-throw-literal */

import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import axios, { AxiosResponse } from 'axios'
import { isNumber, sum } from 'lodash-es'

import { apolloClient } from 'app/apollo.server'
import { DownloadModal } from 'app/components/Download'
import { RunHeader } from 'app/components/Run'
import { AnnotationDrawer } from 'app/components/Run/AnnotationDrawer'
import { AnnotationTable } from 'app/components/Run/AnnotationTable'
import { RunMetadataDrawer } from 'app/components/Run/RunMetadataDrawer'
import { TablePageLayout } from 'app/components/TablePageLayout'
import { QueryParams } from 'app/constants/query'
import { getRunById } from 'app/graphql/getRunById.server'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'
import { DownloadConfig } from 'app/types/download'
import { shouldRevalidatePage } from 'app/utils/revalidate'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const id = params.id ? +params.id : NaN

  if (Number.isNaN(+id)) {
    throw new Response(null, {
      status: 400,
      statusText: 'ID is not defined',
    })
  }

  const url = new URL(request.url)
  const page = +(url.searchParams.get(QueryParams.Page) ?? '1')

  const { data } = await getRunById({
    id,
    page,
    client: apolloClient,
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

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage(args)
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

  const allAnnotations = new Map(
    run.annotation_table
      .flatMap((table) => table.annotations.map((annotation) => annotation))
      .map((annotation) => [annotation.id, annotation]),
  )

  const { downloadConfig, tomogramProcessing, tomogramSampling, annotationId } =
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

  const tomogram = run.tomogram_voxel_spacings.at(0)

  const activeAnnotation = annotationId
    ? allAnnotations.get(+annotationId)
    : null

  return (
    <TablePageLayout
      type={i18n.annotations}
      downloadModal={
        <DownloadModal
          activeAnnotation={activeAnnotation}
          allTomogramProcessing={allTomogramProcessing}
          allTomogramResolutions={allTomogramResolutions}
          datasetId={run.dataset.id}
          datasetTitle={run.dataset.title}
          fileSize={fileSize ?? undefined}
          httpsPath={activeTomogram?.https_mrc_scale0 ?? undefined}
          objectName={activeAnnotation?.object_name}
          runId={run.id}
          runName={run.name}
          s3DatasetPrefix={run.dataset.s3_prefix}
          s3TomogramVoxelPrefix={tomogram?.s3_prefix ?? undefined}
          s3TomogramPrefix={activeTomogram?.s3_mrc_scale0 ?? undefined}
          tomogramId={activeTomogram?.id ?? undefined}
          tomogramVoxelId={tomogram?.id ?? undefined}
          type={annotationId ? 'annotation' : 'runs'}
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
