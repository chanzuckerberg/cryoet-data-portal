import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export function useRunById() {
  const {
    runs: [run],
  } = useTypedLoaderData<GetRunByIdQuery>()

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

  return {
    run,
    objectNames,
    objectShapeTypes,
    annotationSoftwares,

    groundTruthAnnotationsCount: run.annotation_table
      .flatMap((tomogramVoxelSpacing) => tomogramVoxelSpacing.annotations)
      .filter((annotation) => annotation.ground_truth_status)
      .reduce((total, annotation) => total + annotation.files.length, 0),

    // groundTruthAnnotationsCount: run.tomogram_stats.reduce(
    //   (count, stats) =>
    //     count + (stats.ground_truth_annotations_count.aggregate?.count ?? 0),
    //   0,
    // ),

    otherAnnotationsCount: run.annotation_table
      .flatMap((tomogramVoxelSpacing) => tomogramVoxelSpacing.annotations)
      .filter((annotation) => !annotation.ground_truth_status)
      .reduce((total, annotation) => total + annotation.files.length, 0),
  }
}
