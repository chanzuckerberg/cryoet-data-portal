import { useTypedLoaderData } from 'remix-typedjson'

import { GetRunByIdQuery } from 'app/__generated__/graphql'
import { GetRunByIdV2Query } from 'app/__generated_v2__/graphql'
import { isNotNullish } from 'app/utils/nullish'

export function useRunById() {
  const { v1 } = useTypedLoaderData<{
    v1: GetRunByIdQuery
    v2: GetRunByIdV2Query
  }>()

  const run = v1.runs[0]

  const annotationFiles = v1.annotation_files

  const { tomograms } = v1

  const processingMethods = v1.tomograms_for_distinct_processing_methods.map(
    (tomogram) => tomogram.processing,
  )

  const objectNames = v1.annotations_for_object_names.map(
    (annotation) => annotation.object_name,
  )

  const objectShapeTypes = v1.annotation_files_for_shape_types.map(
    (file) => file.shape_type,
  )

  const annotationSoftwares = v1.annotations_for_softwares
    .map((annotation) => annotation.annotation_software)
    .filter(isNotNullish)

  const resolutions = v1.tomograms_for_resolutions.map(
    (tomogram) => tomogram.voxel_spacing,
  )

  const annotationFilesAggregates = {
    totalCount: v1.annotation_files_aggregate_for_total.aggregate?.count ?? 0,
    filteredCount:
      v1.annotation_files_aggregate_for_filtered.aggregate?.count ?? 0,
    groundTruthCount:
      v1.annotation_files_aggregate_for_ground_truth.aggregate?.count ?? 0,
    otherCount: v1.annotation_files_aggregate_for_other.aggregate?.count ?? 0,
  }

  const tomogramsCount = v1.tomograms_aggregate.aggregate?.count ?? 0

  const { deposition } = v1

  return {
    run,
    annotationFiles,
    tomograms,
    processingMethods,
    objectNames,
    objectShapeTypes,
    annotationSoftwares,
    resolutions,
    annotationFilesAggregates,
    tomogramsCount,
    deposition,
  }
}
