import type { I18nProps } from './I18n'

export function MockI18n({ i18nKey, values, linkProps }: I18nProps) {
  return (
    <span
      data-values={JSON.stringify(values)}
      data-link-props={JSON.stringify(linkProps)}
    >
      {i18nKey}
    </span>
  )
}
