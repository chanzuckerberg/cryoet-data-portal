import { useLocation } from '@remix-run/react'
import { useTranslation } from 'react-i18next'

import { Link } from 'app/components/Link'
import { I18nKeys } from 'app/types/i18n'
import { cns } from 'app/utils/cns'

import { AboutAndHelpDropdown } from './AboutAndHelpDropdown'
import { CryoETHomeLink } from './CryoETHomeLink'
import { ToolsDropdown } from './ToolsDropdown'

interface TopNavLink {
  isActive(pathname: string): boolean
  label: I18nKeys
  link: string
}

const TOP_NAV_LINKS: TopNavLink[] = [
  {
    isActive: (pathname) =>
      pathname.includes('/datasets') ||
      pathname.includes('/runs') ||
      pathname.includes('/depositions'),
    label: 'browseData',
    link: '/browse-data/datasets',
  },

  {
    isActive: (pathname) => pathname === '/competition',
    label: 'competition',
    link: '/competition',
  },
]

export function TopNavigation() {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return (
    <nav
      className={cns(
        'bg-sds-gray-black text-sds-gray-white',
        'flex h-[45px] flex-shrink-0 items-center px-sds-xl',
        'sticky top-0 z-30',
      )}
    >
      <CryoETHomeLink />

      {/* Add empty space to push content to right */}
      <div className="hidden screen-716:inline-block basis-sds-xxl flex-grow screen-790:mr-sds-xxl" />

      <div className="hidden screen-716:flex basis-auto flex-shrink-0">
        {TOP_NAV_LINKS.map((link) => (
          <Link
            className={cns(
              'text-sds-header-s leading-sds-header-s font-semibold mr-sds-xxl p-0',

              link.isActive(pathname)
                ? 'text-sds-gray-white'
                : 'text-sds-gray-400 hover:text-sds-gray-white',
            )}
            to={link.link}
            key={link.link}
          >
            {t(link.label)}
          </Link>
        ))}

        <ToolsDropdown className="mr-sds-xxl text-sds-header-s" />
        <AboutAndHelpDropdown className="screen-790:ml-sds-xxl text-sds-header-s" />
      </div>
    </nav>
  )
}
