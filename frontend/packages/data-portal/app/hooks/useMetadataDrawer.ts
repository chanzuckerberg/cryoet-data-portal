import { useCallback } from 'react'

import { QueryParams } from 'app/constants/query'

import { stringParam, useQueryParams } from './useQueryParam'

export enum MetadataDrawerId {
  Annotation = 'annotation',
  Dataset = 'dataset',
  Deposition = 'deposition',
  Run = 'run',
  Tomogram = 'tomogram',
}

export enum MetadataTab {
  HowToCite = 'howToCite',
  Metadata = 'metadata',
  MethodSummary = 'methodSummary',
  ObjectOverview = 'objectOverview',
}

export function useMetadataDrawer() {
  const [queryParams, setQueryParams] = useQueryParams({
    [QueryParams.MetadataDrawer]: stringParam<MetadataDrawerId>(),
    [QueryParams.Tab]: stringParam<MetadataTab>(),
  })

  const activeDrawer = queryParams[QueryParams.MetadataDrawer]
  const activeTab = queryParams[QueryParams.Tab]

  const openDrawer = useCallback(
    (drawer: MetadataDrawerId, tab: MetadataTab = MetadataTab.Metadata) =>
      setQueryParams({
        [QueryParams.MetadataDrawer]: drawer,
        [QueryParams.Tab]: tab,
      }),
    [setQueryParams],
  )

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

  const setActiveTab = useCallback(
    (tab: MetadataTab) => setQueryParams({ [QueryParams.Tab]: tab }),
    [setQueryParams],
  )

  return {
    activeDrawer,
    activeTab,
    closeDrawer,
    openDrawer,
    setActiveTab,
    toggleDrawer,
  }
}
