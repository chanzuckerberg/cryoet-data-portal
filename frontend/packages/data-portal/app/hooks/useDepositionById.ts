import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDepositionByIdQuery } from 'app/__generated__/graphql'

type NonUndefined<T> = T extends undefined ? never : T

export type Dataset = GetDepositionByIdQuery['datasets'][number]

export type Deposition = NonUndefined<GetDepositionByIdQuery['deposition']> & {
  datasets: GetDepositionByIdQuery['datasets']
  datasets_aggregate: GetDepositionByIdQuery['datasets_aggregate']
  filtered_datasets_aggregate: GetDepositionByIdQuery['filtered_datasets_aggregate']
}

export function useDepositionById() {
  const data = useTypedLoaderData<GetDepositionByIdQuery>()

  const objectNames = useMemo(
    () =>
      Array.from(
        new Set(
          data.deposition?.run_stats.flatMap((run) =>
            run.tomogram_voxel_spacings.flatMap((voxelSpacing) =>
              voxelSpacing.annotations.flatMap(
                (annotation) => annotation.object_name,
              ),
            ),
          ),
        ),
      ),
    [data.deposition?.run_stats],
  )

  const objectShapeTypes = useMemo(
    () =>
      Array.from(
        new Set(
          data.deposition?.run_stats.flatMap((run) =>
            run.tomogram_voxel_spacings.flatMap((voxelSpacing) =>
              voxelSpacing.annotations.flatMap((annotation) =>
                annotation.files.flatMap((file) => file.shape_type),
              ),
            ),
          ),
        ),
      ),
    [data.deposition?.run_stats],
  )

  return {
    deposition: {
      ...data.deposition,
      datasets: data.datasets,
      datasets_aggregate: data.datasets_aggregate,
      filtered_datasets_aggregate: data.filtered_datasets_aggregate,
    } as Deposition,
    objectNames,
    objectShapeTypes,
  }
}
