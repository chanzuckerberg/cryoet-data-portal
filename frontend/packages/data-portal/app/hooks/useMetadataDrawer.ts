import { useCallback } from 'react'

import { QueryParams } from 'app/constants/query'

import { stringParam, useQueryParams } from './useQueryParam'

export enum MetadataDrawerId {
  Annotation = 'annotation',
  Dataset = 'dataset',
  Run = 'run',
}

export enum MetadataTab {
  HowToCite = 'howToCite',
  Metadata = 'metadata',
}

export function useMetadataDrawer() {
  const [queryParams, setQueryParams] = useQueryParams({
    [QueryParams.MetadataDrawer]: stringParam<MetadataDrawerId>(),
    [QueryParams.Tab]: stringParam<MetadataTab>(),
  })

  const activeDrawer = queryParams[QueryParams.MetadataDrawer]
  const activeTab = queryParams[QueryParams.Tab]

  const closeDrawer = useCallback(
    () =>
      setQueryParams({
        [QueryParams.MetadataDrawer]: null,
        [QueryParams.Tab]: null,
      }),
    [setQueryParams],
  )

  const toggleDrawer = useCallback(
    (drawer: MetadataDrawerId, tab: MetadataTab = MetadataTab.Metadata) =>
      setQueryParams((prev) => {
        const hasDrawer = !!prev?.[QueryParams.MetadataDrawer]

        return {
          [QueryParams.MetadataDrawer]: hasDrawer ? null : drawer,
          [QueryParams.Tab]: hasDrawer ? null : tab,
        }
      }),
    [setQueryParams],
  )

  return {
    activeDrawer,
    activeTab,
    closeDrawer,
    toggleDrawer,
  }
}
