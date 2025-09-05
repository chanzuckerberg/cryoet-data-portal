import { Link } from 'app/components/Link'
import { SITE_LINKS } from 'app/constants/siteLinks'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

export function CryoETHomeLink({
  textSize = 'text-sds-header-m-600-wide',
}: {
  textSize?: string
}) {
  const { t } = useI18n()

  return (
    <div className="flex items-center gap-sds-s text-light-sds-color-primitive-gray-50">
      <Link
        className={cns(textSize, 'font-semibold', 'ml-2', 'whitespace-nowrap')}
        to={SITE_LINKS.HOME}
      >
        {t('title')}
      </Link>
      <div className="px-sds-xs py-sds-xxxs bg-light-sds-color-primitive-blue-500 rounded-sds-m text-sds-body-xxxs-400-wide">
        {t('beta')}
      </div>
    </div>
  )
}
