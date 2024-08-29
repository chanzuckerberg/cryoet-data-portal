import { I18nKeys } from 'app/types/i18n'

export const methodTypes = ['hybrid', 'automated', 'manual'] as const

export type MethodType = (typeof methodTypes)[number]

type MethodTypeLabels = {
  [key in MethodType]: I18nKeys
}

export const methodLabels: MethodTypeLabels = {
  automated: 'automated',
  hybrid: 'hybrid',
  manual: 'manual',
}

export const methodTooltipLabels: MethodTypeLabels = {
  automated: 'methodTypeAutomated',
  hybrid: 'methodTypeHybrid',
  manual: 'methodTypeManual',
}
