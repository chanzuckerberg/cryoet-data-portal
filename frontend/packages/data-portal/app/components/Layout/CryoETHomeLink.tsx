import { Link } from 'app/components/Link'
import { i18n } from 'app/i18n'

export function CryoETHomeLink() {
  return (
    <div className="flex items-center gap-sds-s text-sds-color-primitive-common-white">
      <Link className="text-sds-header-m font-semibold ml-2 " to="/">
        {i18n.title}
      </Link>
      <div className="px-sds-xs py-sds-xxxs bg-sds-info-400 rounded-sds-m text-sds-body-xxxs">
        {i18n.beta}
      </div>
    </div>
  )
}
