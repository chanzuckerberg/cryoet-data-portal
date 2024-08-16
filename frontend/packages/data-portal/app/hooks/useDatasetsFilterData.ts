import { isString } from 'lodash-es'
import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsFilterDataQuery } from 'app/__generated__/graphql'

export function useDatasetsFilterData() {
  const { datasetsFilterData: data } = useTypedLoaderData<{
    datasetsFilterData: GetDatasetsFilterDataQuery
  }>()

  return useMemo(
    () => ({
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
      data.organism_names,
      data.camera_manufacturers,
      data.reconstruction_methods,
      data.reconstruction_softwares,
      data.object_names,
      data.object_shape_types,
    ],
  )
}
