import { I18nKeys } from 'app/types/i18n'

type MethodTypeLabels = {
  automated: I18nKeys
  hybrid: I18nKeys
  manual: I18nKeys
}

export type MethodType = keyof MethodTypeLabels

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
