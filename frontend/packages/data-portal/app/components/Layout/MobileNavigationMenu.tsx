import { Button } from '@czi-sds/components'

import { Link } from 'app/components/Link'
import { useI18n } from 'app/hooks/useI18n'
import { I18nKeys } from 'app/types/i18n'

import styles from './buttons.module.css'
import {
  ABOUT_LINKS,
  HELP_AND_REPORT_LINKS,
  NavLink,
  TOOLS_LINKS,
  TOP_LEVEL_LINKS,
} from './constants'
import { CryoETHomeLink } from './CryoETHomeLink'

function SubMenu({ title, links }: { title: I18nKeys; links: NavLink[] }) {
  const { t } = useI18n()

  return (
    <div className="border-t border-sds-gray-500 pt-sds-l flex flex-col gap-sds-l">
      <p className="text-sds-caps-xxs leading-sds-caps-xxs font-semibold uppercase text-sds-color-primitive-gray-400">
        {t(title)}
      </p>
      <div className="flex flex-col gap-sds-m">
        {links.map(({ label, link }) => (
          <Link
            key={label}
            to={link}
            className="text-sds-header-m leading-sds-header-m font-semibold text-sds-gray-300"
          >
            {t(label)}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function MobileNavigationMenu({ onClose }: { onClose: () => void }) {
  const { t } = useI18n()

  return (
    <nav className="fixed max-w-[100vw] z-30 top-0 bottom-0 right-0 left-0 bg-sds-color-primitive-common-black screen-716:hidden px-sds-xl overflow-y-scroll">
      <div className="flex justify-between py-sds-m items-center">
        <CryoETHomeLink />
        <Button
          icon="XMark"
          sdsSize="large"
          sdsStyle="icon"
          classes={{
            root: styles.buttonX,
          }}
          onClick={onClose}
        />
      </div>
      <div className="flex flex-col py-sds-l gap-sds-xl">
        {TOP_LEVEL_LINKS.map(({ label, link }) => (
          <Link
            key={label}
            to={link}
            className="text-sds-header-m leading-sds-header-m font-semibold text-sds-color-primitive-gray-300"
          >
            {t(label)}
          </Link>
        ))}
        <SubMenu title="tools" links={TOOLS_LINKS} />
        <SubMenu title="about" links={ABOUT_LINKS} />
        <SubMenu title="helpAndReport" links={HELP_AND_REPORT_LINKS} />
      </div>
    </nav>
  )
}
