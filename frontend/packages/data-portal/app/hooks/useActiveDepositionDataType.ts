import { QueryParams } from 'app/constants/query'
import { DataContentsType } from 'app/types/deposition-queries'

import { useQueryParam } from './useQueryParam'

export function useActiveDepositionDataType(preventScrollReset?: boolean) {
  return useQueryParam<DataContentsType, DataContentsType>(
    QueryParams.DepositionTab,
    { preventScrollReset, defaultValue: DataContentsType.Annotations },
  )
}
