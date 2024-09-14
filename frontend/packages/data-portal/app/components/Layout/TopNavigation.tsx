import { ButtonIcon } from '@czi-sds/components'
import { useLocation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from 'app/components/Link'
import { cns } from 'app/utils/cns'

import { AboutAndHelpDropdown } from './AboutAndHelpDropdown'
import { TOP_LEVEL_LINKS } from './constants'
import { CryoETHomeLink } from './CryoETHomeLink'
import { MobileNavigationMenu } from './MobileNavigationMenu'
import { ToolsDropdown } from './ToolsDropdown'

export function TopNavigation() {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  const [mobileMenuIsOpen, setMobileMenuOpen] = useState(false)

  // force close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav
      className={cns(
        'bg-sds-gray-black text-sds-gray-white',
        'flex py-sds-m flex-shrink-0 items-center px-sds-xl',
        'sticky top-0 z-30',
      )}
    >
      <CryoETHomeLink />

      {/* Add empty space to push content to right */}
      <div className="basis-sds-xxl flex-grow screen-790:mr-sds-xxl" />

      <div className="hidden screen-716:flex basis-auto flex-shrink-0">
        {TOP_LEVEL_LINKS.map((link) => (
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

      <ButtonIcon
        className="screen-716:!hidden"
        sdsIcon="linesHorizontal"
        sdsType="tertiary"
        sdsSize="large"
        classes={{
          root: '!text-sds-gray-400',
        }}
        onClick={() => setMobileMenuOpen(true)}
      />

      {mobileMenuIsOpen && (
        <MobileNavigationMenu onClose={() => setMobileMenuOpen(false)} />
      )}
    </nav>
  )
}
