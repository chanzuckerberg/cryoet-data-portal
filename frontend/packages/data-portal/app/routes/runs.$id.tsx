/* eslint-disable @typescript-eslint/no-throw-literal */

import { ShouldRevalidateFunctionArgs } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/server-runtime'
import { isNumber, sum } from 'lodash-es'
import { useMemo } from 'react'
import { match } from 'ts-pattern'

import { apolloClient } from 'app/apollo.server'
import { TablePageLayout } from 'app/components//TablePageLayout'
import { AnnotationFilter } from 'app/components/AnnotationFilter/AnnotationFilter'
import { DownloadModal } from 'app/components/Download'
import { RunHeader } from 'app/components/Run'
import { AnnotationDrawer } from 'app/components/Run/AnnotationDrawer'
import { AnnotationTable } from 'app/components/Run/AnnotationTable'
import { RunMetadataDrawer } from 'app/components/Run/RunMetadataDrawer'
import { QueryParams } from 'app/constants/query'
import { getRunById } from 'app/graphql/getRunById.server'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useFileSize } from 'app/hooks/useFileSize'
import { useI18n } from 'app/hooks/useI18n'
import { useRunById } from 'app/hooks/useRunById'
import { i18n } from 'app/i18n'
import { Annotation } from 'app/state/annotation'
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
    params: url.searchParams,
  })

  if (data.runs.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: `Run with ID ${id} not found`,
    })
  }

  return json(data)
}

export function shouldRevalidate(args: ShouldRevalidateFunctionArgs) {
  return shouldRevalidatePage({
    ...args,
    paramsToRefetch: [
      QueryParams.AuthorName,
      QueryParams.AuthorOrcid,
      QueryParams.ObjectName,
      QueryParams.GoId,
      QueryParams.ObjectShapeType,
      QueryParams.MethodType,
      QueryParams.AnnotationSoftware,
    ],
  })
}

export default function RunByIdPage() {
  const { run } = useRunById()

  // TODO: convert to useMemo
  const totalCount = sum(
    run.tomogram_stats.flatMap(
      (stats) => stats.annotations_aggregate.aggregate?.count ?? 0,
    ),
  )

  const filteredCount = sum(
    run.tomogram_stats.flatMap(
      (stats) => stats.filtered_annotations_count.aggregate?.count ?? 0,
    ),
  )

  const allTomogramResolutions = run.tomogram_stats.flatMap((stats) =>
    stats.tomogram_resolutions.map((tomogram) => tomogram),
  )

  const allTomogramProcessing = run.tomogram_stats.flatMap((stats) =>
    stats.tomogram_processing.map((tomogram) => tomogram.processing),
  )

  const {
    downloadConfig,
    tomogramProcessing,
    tomogramSampling,
    annotationId,
    fileFormat,
    objectShapeType,
  } = useDownloadModalQueryParamState()

  const activeTomogram =
    (downloadConfig === DownloadConfig.Tomogram &&
      allTomogramResolutions.find(
        (tomogram) =>
          `${tomogram.voxel_spacing}` === tomogramSampling &&
          tomogram.processing === tomogramProcessing,
      )) ||
    null

  const tomogram = run.tomogram_voxel_spacings.at(0)
  const { t } = useI18n()

  const activeAnnotation = useMemo(() => {
    const allAnnotations = new Map(
      run.annotation_table
        .flatMap((table) => table.annotations.map((annotation) => annotation))
        .map((annotation) => [annotation.id, annotation]),
    )

    const activeBaseAnnotation = annotationId
      ? allAnnotations.get(+annotationId)
      : null

    const activeAnnotationFile = objectShapeType
      ? activeBaseAnnotation?.files.find(
          (file) => file.shape_type === objectShapeType,
        )
      : null

    const result =
      activeBaseAnnotation && activeAnnotationFile
        ? {
            ...activeBaseAnnotation,
            ...activeAnnotationFile,
          }
        : null

    return result as Annotation | null
  }, [annotationId, objectShapeType, run.annotation_table])

  const httpsPath = useMemo(() => {
    if (activeAnnotation) {
      return activeAnnotation.files?.find(
        (file) =>
          file.format === fileFormat && file.shape_type === objectShapeType,
      )?.https_path
    }

    return activeTomogram?.https_mrc_scale0 ?? undefined
  }, [
    activeAnnotation,
    activeTomogram?.https_mrc_scale0,
    fileFormat,
    objectShapeType,
  ])

  const { data: fileSize } = useFileSize(httpsPath, {
    enabled: fileFormat !== 'zarr',
  })

  const activeTomogramResolution = useMemo(
    () =>
      allTomogramResolutions.find((resolution) =>
        tomogramSampling !== null && isNumber(+tomogramSampling)
          ? resolution.voxel_spacing === +tomogramSampling
          : false,
      ),
    [allTomogramResolutions, tomogramSampling],
  )

  return (
    <TablePageLayout
      header={<RunHeader />}
      tabs={[
        {
          title: t('annotations'),
          filterPanel: <AnnotationFilter />,
          filteredCount,
          table: <AnnotationTable />,
          pageQueryParam: QueryParams.AnnotationsPage,
          totalCount,
          countLabel: i18n.annotations,
        },
      ]}
      downloadModal={
        <DownloadModal
          activeAnnotation={activeAnnotation}
          activeTomogramResolution={activeTomogramResolution}
          allTomogramProcessing={allTomogramProcessing}
          allTomogramResolutions={allTomogramResolutions}
          datasetId={run.dataset.id}
          datasetTitle={run.dataset.title}
          fileSize={fileSize}
          httpsPath={httpsPath}
          objectName={activeAnnotation?.object_name}
          runId={run.id}
          runName={run.name}
          s3Path={match({
            annotationId,
            downloadConfig,
            fileFormat,
          })
            .with(
              { downloadConfig: DownloadConfig.Tomogram, fileFormat: 'mrc' },
              () => activeTomogram?.s3_mrc_scale0,
            )
            .with(
              { downloadConfig: DownloadConfig.Tomogram, fileFormat: 'zarr' },
              () => activeTomogram?.s3_omezarr_dir,
            )
            .with({ downloadConfig: DownloadConfig.AllAnnotations }, () =>
              tomogram?.s3_prefix
                ? `${tomogram.s3_prefix}Annotations`
                : undefined,
            )
            .with(
              { annotationId },
              () =>
                activeAnnotation?.files.find(
                  (file) =>
                    file.format === fileFormat &&
                    file.shape_type === objectShapeType,
                )?.s3_path,
            )
            .otherwise(() => undefined)}
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
    />
  )
}
