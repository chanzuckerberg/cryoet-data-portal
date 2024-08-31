import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'

import { MethodLinkProps } from './common'

export function MethodLink({ icon, i18nLabel, url, title }: MethodLinkProps) {
  const { t } = useI18n()

  return (
    <span className="text-sds-body-s leading-sds-body-s flex flex-row whitespace-nowrap overflow-hidden text-ellipsis">
      <span className="text-sds-gray-black items-center flex flex-row">
        {icon}
        <span className="font-semibold ml-sds-xxs mr-sds-xs">
          {t(i18nLabel)}:
        </span>
      </span>
      <Link
        to={url}
        className="text-sds-info-400 overflow-hidden text-ellipsis"
      >
        {title ?? url}
      </Link>
    </span>
  )
}
