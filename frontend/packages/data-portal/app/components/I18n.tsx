import { Trans, TransProps } from 'react-i18next'
import { Required } from 'utility-types'

import type { I18nKeys } from 'app/types/i18n'
import { DASHED_BORDERED_CLASSES } from 'app/utils/classNames'
import { cns } from 'app/utils/cns'

import { Link, VariantLinkProps } from './Link'

interface Props extends Omit<TransProps<I18nKeys>, 'ns' | 'i18nKey'> {
  i18nKey: I18nKeys
  linkProps?: Partial<VariantLinkProps>
}

/**
 * Wrapper over `Trans` component with strong typing support for i18n keys. It
 * also includes a few default components for rendering inline JSX.
 */
export function I18n({ i18nKey, components, linkProps, ...props }: Props) {
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
        dash: (
          <span
            className={cns(
              DASHED_BORDERED_CLASSES,
              'border-sds-gray-600 hover:border-dashed',
            )}
          />
        ),

        urlNoColor: (
          <Link {...(linkProps as Required<Partial<VariantLinkProps>, 'to'>)}>
            {/* This will get replaced by I18next */}
            tmp
          </Link>
        ),

        url: (
          <Link
            className="text-sds-primary-500"
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
