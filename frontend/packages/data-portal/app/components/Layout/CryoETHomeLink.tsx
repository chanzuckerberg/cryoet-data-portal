import { CryoETIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { i18n } from 'app/i18n'

export function CryoETHomeLink() {
  return (
    <div className="flex items-center gap-1 text-sds-gray-white">
      <CryoETIcon />

      <Link className="text-sds-header-m font-semibold ml-2 " to="/">
        {i18n.title}
      </Link>
    </div>
  )
}
