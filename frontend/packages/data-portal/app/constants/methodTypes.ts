import { Annotation_Method_Type_Enum } from 'app/__generated_v2__/graphql'
import { I18nKeys } from 'app/types/i18n'
import { checkExhaustive } from 'app/types/utils'

export const methodTypes = ['hybrid', 'automated', 'manual'] as const

export type MethodType = (typeof methodTypes)[number]

type MethodTypeLabels = {
  [key in MethodType]: I18nKeys
}

/** @deprecated */
export const methodLabels: MethodTypeLabels = {
  automated: 'automated',
  hybrid: 'hybrid',
  manual: 'manual',
}

export function getMethodTypeLabelI18nKey(
  methodType: Annotation_Method_Type_Enum,
): I18nKeys {
  switch (methodType) {
    case Annotation_Method_Type_Enum.Automated:
      return 'automated'
    case Annotation_Method_Type_Enum.Hybrid:
      return 'hybrid'
    case Annotation_Method_Type_Enum.Manual:
      return 'manual'
    case Annotation_Method_Type_Enum.Simulated:
      return 'simulated'
    default:
      return checkExhaustive(methodType)
  }
}

/** @deprecated */
export const methodTooltipLabels: MethodTypeLabels = {
  automated: 'methodTypeAutomated',
  hybrid: 'methodTypeHybrid',
  manual: 'methodTypeManual',
}

export function getMethodTypeTooltipI18nKey(
  methodType: Annotation_Method_Type_Enum,
): I18nKeys {
  switch (methodType) {
    case Annotation_Method_Type_Enum.Automated:
      return 'methodTypeAutomated'
    case Annotation_Method_Type_Enum.Hybrid:
      return 'methodTypeHybrid'
    case Annotation_Method_Type_Enum.Manual:
      return 'methodTypeManual'
    case Annotation_Method_Type_Enum.Simulated:
      return 'methodTypeSimulated'
    default:
      return checkExhaustive(methodType)
  }
}
