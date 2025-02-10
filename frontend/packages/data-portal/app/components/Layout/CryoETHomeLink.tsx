import { Link } from 'app/components/Link'
import { SiteLinks } from 'app/constants/siteLinks'
import { useI18n } from 'app/hooks/useI18n'

export function CryoETHomeLink() {
  const { t } = useI18n()

  return (
    <div className="flex items-center gap-sds-s text-sds-color-primitive-common-white">
      <Link
        className="text-sds-header-m font-semibold ml-2 whitespace-nowrap"
        to={SiteLinks.HOME}
      >
        {asdf}
      </Link>
      <div className="px-sds-xs py-sds-xxxs bg-sds-color-primitive-blue-400 rounded-sds-m text-sds-body-xxxs">
        {t('beta')}
      </div>
    </div>
  )
}
