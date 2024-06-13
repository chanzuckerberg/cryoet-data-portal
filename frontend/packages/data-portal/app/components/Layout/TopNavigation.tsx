import { useLocation } from '@remix-run/react'
import { useTranslation } from 'react-i18next'

import { Link } from 'app/components/Link'
import { I18nKeys } from 'app/types/i18n'
import { cns } from 'app/utils/cns'
import { useFeatureFlag } from 'app/utils/featureFlags'

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
      pathname.includes('/datasets') || pathname.includes('/runs'),
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
  const showMlChallenge = useFeatureFlag('mlChallenge')

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
      <div className="flex-grow" />

      {TOP_NAV_LINKS.filter(
        (link) => showMlChallenge || link.label !== 'competition',
      ).map((link) => (
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
      <AboutAndHelpDropdown className="ml-sds-xxl text-sds-header-s" />
    </nav>
  )
}
