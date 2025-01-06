import { isString } from 'lodash-es'
import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDatasetsFilterDataQuery } from 'app/__generated__/graphql'

export function useDatasetsFilterData() {
  const { v1FilterValues: v1 } = useTypedLoaderData<{
    v1FilterValues: GetDatasetsFilterDataQuery
  }>()

  return useMemo(
    () => ({
      organismNames: v1.organism_names
        .map((value) => value.organism_name)
        .filter(isString),

      cameraManufacturers: v1.camera_manufacturers.map(
        (value) => value.camera_manufacturer,
      ),

      reconstructionMethods: v1.reconstruction_methods.map(
        (value) => value.reconstruction_method,
      ),

      reconstructionSoftwares: v1.reconstruction_softwares.map(
        (value) => value.reconstruction_software,
      ),

      objectNames: v1.object_names.map((value) => value.object_name),

      objectShapeTypes: v1.object_shape_types.map((value) => value.shape_type),
    }),
    [
      v1.organism_names,
      v1.camera_manufacturers,
      v1.reconstruction_methods,
      v1.reconstruction_softwares,
      v1.object_names,
      v1.object_shape_types,
    ],
  )
}
