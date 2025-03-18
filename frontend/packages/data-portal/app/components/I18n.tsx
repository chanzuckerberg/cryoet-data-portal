import { Trans, TransProps } from 'react-i18next'
import { Required } from 'utility-types'

import type { I18nKeys } from 'app/types/i18n'

import { Link, VariantLinkProps } from './Link'

export interface I18nProps
  extends Omit<TransProps<I18nKeys>, 'ns' | 'i18nKey'> {
  i18nKey: I18nKeys
  linkProps?: Partial<VariantLinkProps>
}

/**
 * Wrapper over `Trans` component with strong typing support for i18n keys. It
 * also includes a few default components for rendering inline JSX.
 */
export function I18n({ i18nKey, components, linkProps, ...props }: I18nProps) {
  return (
    <Trans
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
      ns="translation"
      i18nKey={i18nKey}
      // Components to use when replacing inline i18n JSX.
      components={{
        bold: <span className="font-bold" />,
        semibold: <span className="font-semibold" />,
        code: <span className="font-mono" />,
        ellipsis: <span className="overflow-hidden text-ellipsis" />,

        urlNoColor: (
          <Link {...(linkProps as Required<Partial<VariantLinkProps>, 'to'>)}>
            {/* This will get replaced by I18next */}
            tmp
          </Link>
        ),

        sdsLink: (
          <Link
            className="border-b border-dashed hover:border-solid border-current"
            {...(linkProps as Required<Partial<VariantLinkProps>, 'to'>)}
          >
            {/* This will get replaced by I18next */}
            tmp
          </Link>
        ),

        url: (
          <Link
            className="text-light-sds-color-primitive-blue-400"
            {...(linkProps as Required<Partial<VariantLinkProps>, 'to'>)}
          >
            {/* This will get replaced by I18next */}
            tmp
          </Link>
        ),

        ...components,
      }}
    />
  )
}
