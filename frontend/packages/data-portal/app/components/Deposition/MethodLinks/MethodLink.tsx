import { ReactNode } from 'react'

import { Link, VariantLinkProps } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
import { I18nKeys } from 'app/types/i18n'
import { cns } from 'app/utils/cns'

export interface MethodLinkProps {
  i18nLabel: I18nKeys
  url: string
  icon: ReactNode
  title?: string
  className?: string
  linkProps?: Partial<VariantLinkProps>
  simple?: boolean
}

export function MethodLink({
  icon,
  i18nLabel,
  url,
  title,
  className,
  linkProps,
  simple,
}: MethodLinkProps) {
  const { t } = useI18n()

  if (simple) {
    return (
      <Link to={url} {...linkProps}>
        {title ?? url}
      </Link>
    )
  }

  return (
    <span className={cns('flex flex-row', className)}>
      <span className="text-light-sds-color-primitive-gray-900 items-center flex flex-row">
        {icon}
        <span className="font-semibold ml-sds-xxs mr-sds-xs whitespace-nowrap">
          {t(i18nLabel)}:
        </span>
      </span>

      <Link to={url} {...linkProps}>
        {title?.replace('on GitHub', '') ?? url}
      </Link>
    </span>
  )
}
