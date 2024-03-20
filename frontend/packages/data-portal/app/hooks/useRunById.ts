import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetRunByIdQuery } from 'app/__generated__/graphql'

export function useRunById() {
  const {
    data: {
      runs: [run],
    },
    fileSizeMap,
  } = useTypedLoaderData<{
    data: GetRunByIdQuery
    fileSizeMap: Record<string, number>
  }>()

  const objectNames = useMemo(
    () =>
      Array.from(
        new Set(
          run.tomogram_stats.flatMap((voxelSpacing) =>
            voxelSpacing.annotations.flatMap(
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
              annotation.files.flatMap((file) => file.shape_type),
            ),
          ),
        ),
      ),
    [run],
  )

  return { run, fileSizeMap, objectNames, objectShapeTypes }
}
