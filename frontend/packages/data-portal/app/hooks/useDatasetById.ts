import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetByIdQuery } from 'app/__generated__/graphql'

export function useDatasetById() {
  const {
    datasets: [dataset],
    deposition,
  } = useTypedLoaderData<GetDatasetByIdQuery>()

  const objectNames = useMemo(
    () =>
      Array.from(
        new Set(
          dataset.run_stats.flatMap((run) =>
            run.tomogram_voxel_spacings.flatMap((voxelSpacing) =>
              voxelSpacing.annotations.flatMap(
                (annotation) => annotation.object_name,
              ),
            ),
          ),
        ),
      ),
    [dataset.run_stats],
  )

  const objectShapeTypes = useMemo(
    () =>
      Array.from(
        new Set(
          dataset.run_stats.flatMap((run) =>
            run.tomogram_voxel_spacings.flatMap((voxelSpacing) =>
              voxelSpacing.annotations.flatMap((annotation) =>
                annotation.files.flatMap((file) => file.shape_type),
              ),
            ),
          ),
        ),
      ),
    [dataset.run_stats],
  )

  return {
    dataset,
    objectNames,
    objectShapeTypes,
    deposition,
  }
}
