import { isString } from 'lodash-es'
import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsDataQuery } from 'app/__generated__/graphql'

export type Dataset = GetDatasetsDataQuery['datasets'][number]

export function useDatasets() {
  const data = useTypedLoaderData<GetDatasetsDataQuery>()

  return useMemo(
    () => ({
      datasets: data.datasets,
      datasetCount: data.datasets_aggregate.aggregate?.count ?? 0,

      filteredDatasetCount:
        data.filtered_datasets_aggregate.aggregate?.count ?? 0,

      organismNames: data.organism_names
        .map((value) => value.organism_name)
        .filter(isString),

      cameraManufacturers: data.camera_manufacturers.map(
        (value) => value.camera_manufacturer,
      ),

      reconstructionMethods: data.reconstruction_methods.map(
        (value) => value.reconstruction_method,
      ),

      reconstructionSoftwares: data.reconstruction_softwares.map(
        (value) => value.reconstruction_software,
      ),

      objectNames: data.object_names.map((value) => value.object_name),

      objectShapeTypes: data.object_shape_types.map(
        (value) => value.shape_type,
      ),
    }),
    [
      data.camera_manufacturers,
      data.datasets,
      data.datasets_aggregate.aggregate?.count,
      data.filtered_datasets_aggregate.aggregate?.count,
      data.object_names,
      data.object_shape_types,
      data.organism_names,
      data.reconstruction_methods,
      data.reconstruction_softwares,
    ],
  )
}
