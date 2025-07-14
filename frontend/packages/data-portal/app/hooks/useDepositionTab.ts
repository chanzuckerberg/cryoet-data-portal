import { QueryParams } from 'app/constants/query'

import { useQueryParam } from './useQueryParam'

export enum DepositionTab {
  Annotations = 'annotations',
  Tomograms = 'tomograms',
}

export function useDepositionTab() {
  return useQueryParam<DepositionTab, DepositionTab>(
    QueryParams.DepositionTab,
    { defaultValue: DepositionTab.Annotations },
  )
}
