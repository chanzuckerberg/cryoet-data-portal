import { Button } from '@czi-sds/components'
import { useLocation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Link } from 'app/components/Link'
import { cns } from 'app/utils/cns'
import { useFeatureFlag } from 'app/utils/featureFlags'

import { AboutAndHelpDropdown } from './AboutAndHelpDropdown'
import styles from './buttons.module.css'
import { TOP_LEVEL_LINKS, TOP_LEVEL_LINKS_COMPETITION } from './constants'
import { CryoETHomeLink } from './CryoETHomeLink'
import { MobileNavigationMenu } from './MobileNavigationMenu'
import { ToolsDropdown } from './ToolsDropdown'

export function TopNavigation() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const showPostMlChallenge = useFeatureFlag('postMlChallenge')

  const [mobileMenuIsOpen, setMobileMenuOpen] = useState(false)

  // force close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // TODO: (smccanny) Remove once post competition page is live
  const TEMP_LINKS = showPostMlChallenge
    ? TOP_LEVEL_LINKS
    : TOP_LEVEL_LINKS_COMPETITION

  const isItNeuroglancerPage = pathname.includes("/view/runs/");

  if(isItNeuroglancerPage) {
    return null;
  }

  
  return (
    <nav
      className={cns(
        'bg-sds-color-primitive-common-black text-sds-color-primitive-common-white',
        'flex py-sds-m flex-shrink-0 items-center px-sds-xl',
        'sticky top-0 z-30',
      )}
    >
      <CryoETHomeLink />

      {/* Add empty space to push content to right */}
      <div className="basis-sds-xxl flex-grow screen-790:mr-sds-xxl" />

      <div className="hidden screen-716:flex basis-auto flex-shrink-0">
        {TEMP_LINKS.map((link) => (
          <Link
            className={cns(
              'text-sds-header-s leading-sds-header-s font-semibold mr-sds-xxl p-0',
              link.isActive(pathname)
                ? 'text-sds-color-primitive-common-white'
                : 'text-sds-color-primitive-gray-400 hover:text-sds-color-primitive-common-white',
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

      <Button
        className="screen-716:!hidden"
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
