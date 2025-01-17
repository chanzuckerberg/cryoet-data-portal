import type { I18nProps } from './I18n'

/**
 * Mock I18n component for rendering span element with i18n key as the content.
 * Any values are passed in the data-attribute prop in case values need to be
 * tested.
 */
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
