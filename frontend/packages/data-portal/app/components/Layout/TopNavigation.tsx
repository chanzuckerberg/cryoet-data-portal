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
        'bg-sds-color-primitive-common-black text-sds-color-primitive-common-white',
        'flex h-[45px] flex-shrink-0 items-center px-sds-xl',
        'sticky top-0 z-30',
      )}
    >
      <CryoETHomeLink />

      {/* Add empty space to push content to right */}
      <div className="flex-grow" />

      {TOP_NAV_LINKS.map((link) => (
        <Link
          className={cns(
            'text-sds-header-s leading-sds-header-s font-semibold mr-sds-xxl p-0',

            link.isActive(pathname)
              ? 'text-sds-color-primitive-common-white'
              : 'text-sds-gray-400 hover:text-sds-color-primitive-common-white',
          )}
          to={link.link}
          key={link.link}
        >
          {t(link.label)}
        </Link>
      ))}

      <ToolsDropdown className="mr-sds-xxl text-sds-header-s" />
      <AboutAndHelpDropdown className="ml-sds-xxl text-sds-header-s" />
    </nav>
  )
}
