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
  }
}
