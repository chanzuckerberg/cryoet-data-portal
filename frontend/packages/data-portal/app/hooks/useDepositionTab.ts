import { QueryParams } from 'app/constants/query'
import { DataContentsType } from 'app/types/deposition-queries'

import { useQueryParam } from './useQueryParam'

export function useDepositionTab() {
  return useQueryParam<DataContentsType, DataContentsType>(
    QueryParams.DepositionTab,
    { defaultValue: DataContentsType.Annotations },
  )
}
