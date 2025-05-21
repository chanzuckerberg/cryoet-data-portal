import { QueryParams } from 'app/constants/query'
import { useQueryParam } from 'app/hooks/useQueryParam'

import { MethodSummaryTab } from './types'

const DEFAULT_ANNOTATION_TAB = MethodSummaryTab.Annotations

export function useMethodSummaryTab() {
  return useQueryParam<MethodSummaryTab>(QueryParams.MethodSummaryTab, {
    defaultValue: DEFAULT_ANNOTATION_TAB,
  })
}
