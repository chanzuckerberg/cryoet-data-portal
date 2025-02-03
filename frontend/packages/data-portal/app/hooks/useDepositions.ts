import { useMemo } from 'react'
import { useTypedLoaderData } from 'remix-typedjson'

import { GetDepositionsDataQuery } from 'app/__generated__/graphql'
import { GetDepositionsDataV2Query } from 'app/__generated_v2__/graphql'
import {
  remapV1BrowseAllDepositions,
  remapV2BrowseAllDepositions,
} from 'app/apiNormalization'
import { BrowseAllDepositionsPageDataType } from 'app/types/PageData/browseAllDepositionsPageData'
import { pickAPISource } from 'app/utils/apiMigration'

export function useDepositions() {
  const { v1, v2 } = useTypedLoaderData<{
    v1: GetDepositionsDataQuery
    v2: GetDepositionsDataV2Query
  }>()

  const v1result = useMemo(() => remapV1BrowseAllDepositions(v1), [v1])
  const v2result = useMemo(() => remapV2BrowseAllDepositions(v2), [v2])

  const combined = useMemo(
    () =>
      pickAPISource<BrowseAllDepositionsPageDataType>(
        { v1: v1result, v2: v2result },
        {
          allObjectNames: 'v2',
          allObjectShapeTypes: 'v2',
          filteredDepositionCount: 'v2',
          totalDepositionCount: 'v2',
          depositions: {
            acrossDatasets: 'v2',
            annotationCount: 'v2',
            annotatedObjects: 'v2',
            authors: 'v2',
            depositionDate: 'v2',
            id: 'v2',
            keyPhotoThumbnailUrl: 'v2',
            objectShapeTypes: 'v2',
            title: 'v2',
          },
        },
      ),
    [v1result, v2result],
  )

  return combined
}
