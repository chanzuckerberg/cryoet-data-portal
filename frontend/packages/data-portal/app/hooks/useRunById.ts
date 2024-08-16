import { useTypedLoaderData } from 'remix-typedjson'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export function useRunById() {
  const data = useTypedLoaderData<GetRunByIdQuery>()

  const run = data.runs[0]

  const annotationFiles = data.annotation_files

  const { tomograms } = data

  const tomogramsForDownload = data.tomograms_for_download

  const processingMethods = data.tomograms_for_distinct_processing_methods.map(
    (tomogram) => tomogram.processing,
  )

  const objectNames = data.annotations_for_object_names.map(
    (annotation) => annotation.object_name,
  )

  const objectShapeTypes = data.annotation_files_for_shape_types.map(
    (file) => file.shape_type,
  )

  const annotationSoftwares = data.annotations_for_softwares
    .map((annotation) => annotation.annotation_software)
    .filter((software) => software != null)

  const resolutions = data.tomograms_for_resolutions.map(
    (tomogram) => tomogram.voxel_spacing,
  )

  const annotationFilesAggregates = {
    totalCount: data.annotation_files_aggregate_for_total.aggregate?.count ?? 0,
    filteredCount:
      data.annotation_files_aggregate_for_filtered.aggregate?.count ?? 0,
    groundTruthCount:
      data.annotation_files_aggregate_for_ground_truth.aggregate?.count ?? 0,
    otherCount: data.annotation_files_aggregate_for_other.aggregate?.count ?? 0,
  }

  const tomogramsCount = data.tomograms_aggregate.aggregate?.count ?? 0

  return {
    run,
    annotationFiles,
    tomograms,
    tomogramsForDownload,
    processingMethods,
    objectNames,
    objectShapeTypes,
    annotationSoftwares,
    resolutions,
    annotationFilesAggregates,
    tomogramsCount,
  }
}
