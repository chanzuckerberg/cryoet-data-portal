import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export function useRunById() {
  const data = useTypedLoaderData<GetRunByIdQuery>()

  const run = data.runs[0]

  const annotationFiles = data.annotation_files

  const { tomograms } = data

  const objectNames = useMemo(
    () =>
      Array.from(
        new Set(
          run.tomogram_stats.flatMap((voxelSpacing) =>
            voxelSpacing.annotations.map(
              (annotation) => annotation.object_name,
            ),
          ),
        ),
      ),
    [run],
  )

  const objectShapeTypes = useMemo(
    () =>
      Array.from(
        new Set(
          run.tomogram_stats.flatMap((voxelSpacing) =>
            voxelSpacing.annotations.flatMap((annotation) =>
              annotation.files.map((file) => file.shape_type),
            ),
          ),
        ),
      ),
    [run],
  )

  const annotationSoftwares = useMemo(
    () =>
      Array.from(
        new Set(
          run.tomogram_stats.flatMap((voxelSpacing) =>
            voxelSpacing.annotations
              .filter((annotation) => annotation.annotation_software)
              .map((annotation) => annotation.annotation_software as string),
          ),
        ),
      ),
    [run],
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
    objectNames,
    objectShapeTypes,
    annotationSoftwares,
    annotationFilesAggregates,
    tomogramsCount,
  }
}
