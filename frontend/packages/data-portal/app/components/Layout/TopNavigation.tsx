import { useLocation } from '@remix-run/react'

import { Link } from 'app/components/Link'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

import { AboutAndHelpDropdown } from './AboutAndHelpDropdown'
import { CryoETHomeLink } from './CryoETHomeLink'
import { ToolsDropdown } from './ToolsDropdown'

export function TopNavigation() {
  const { pathname } = useLocation()

  return (
    <nav
      className={cns(
        'bg-sds-gray-black text-sds-gray-white',
        'flex h-[45px] min-h-[45px] items-center px-sds-xl',
        'sticky top-0 z-30',
      )}
    >
      <CryoETHomeLink />

      {/* Add empty space to push content to right */}
      <div className="flex-grow" />

      <Link
        className={cns(
          'text-sds-header-s font-semibold mx-sds-xxl p-0',

          pathname.startsWith('/datasets')
            ? 'text-sds-gray-white'
            : 'text-sds-gray-400',
        )}
        to="/browse-data/datasets"
      >
        {i18n.browseData}
      </Link>

      <ToolsDropdown className="mr-sds-xxl text-sds-header-s" />
      <AboutAndHelpDropdown className="ml-sds-xxl text-sds-header-s" />
    </nav>
  )
}
