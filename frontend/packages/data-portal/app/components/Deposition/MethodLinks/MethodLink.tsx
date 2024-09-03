import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { MethodLinkProps } from './common'

export function MethodLink({
  icon,
  i18nLabel,
  url,
  title,
  className,
  linkProps,
}: MethodLinkProps) {
  const { t } = useI18n()

  return (
    <span className={cns('flex flex-row', className)}>
      <span className="text-sds-gray-black items-center flex flex-row">
        {icon}
        <span className="font-semibold ml-sds-xxs mr-sds-xs">
          {t(i18nLabel)}:
        </span>
      </span>

      <Link to={url} {...linkProps}>
        {title ?? url}
      </Link>
    </span>
  )
}
