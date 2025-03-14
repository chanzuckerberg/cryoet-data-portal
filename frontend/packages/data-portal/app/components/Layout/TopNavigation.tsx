import { Button } from '@czi-sds/components'
import { useLocation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from 'app/components/Link'
import { cns, cnsNoMerge } from 'app/utils/cns'

import { AboutAndReportDropdown } from './AboutAndReportDropdown'
import styles from './buttons.module.css'
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
        'bg-light-sds-color-primitive-gray-900  text-light-sds-color-primitive-gray-50',
        'flex py-sds-m flex-shrink-0 items-center px-sds-xl',
        'sticky top-0 z-30',
      )}
    >
      <CryoETHomeLink />

      {/* Add empty space to push content to right */}
      <div className="basis-sds-xxl flex-grow screen-1024:mr-sds-xxl" />

      <div className="hidden screen-1024:flex basis-auto flex-shrink-0">
        {TOP_LEVEL_LINKS.map((link) => (
          <Link
            className={cnsNoMerge(
              'leading-sds-header-s font-semibold mr-sds-xxl p-0 text-sds-header-s',
              link.isActive && link.isActive(pathname)
                ? 'text-light-sds-color-primitive-gray-50'
                : 'text-light-sds-color-primitive-gray-400 hover:text-light-sds-color-primitive-gray-50',
            )}
            to={link.link}
            key={link.link}
          >
            {t(link.label)}
          </Link>
        ))}

        <ToolsDropdown className="mr-sds-xxl text-sds-header-s" />
        <AboutAndReportDropdown className="screen-1024:ml-sds-xxl text-sds-header-s" />
      </div>

      <Button
        className="screen-1024:!hidden"
        icon="LinesHorizontal3"
        sdsStyle="icon"
        sdsType="tertiary"
        sdsSize="large"
        classes={{
          root: styles.buttonHamburger,
        }}
        onClick={() => setMobileMenuOpen(true)}
      />

      {mobileMenuIsOpen && (
        <MobileNavigationMenu onClose={() => setMobileMenuOpen(false)} />
      )}
    </nav>
  )
}
