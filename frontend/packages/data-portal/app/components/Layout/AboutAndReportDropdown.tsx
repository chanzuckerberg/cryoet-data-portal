import { MenuDropdown } from 'app/components/MenuDropdown'
import { MenuItemHeader } from 'app/components/MenuItemHeader'
import { MenuItemLink } from 'app/components/MenuItemLink'
import { useI18n } from 'app/hooks/useI18n'

import { ABOUT_LINKS, REPORT_LINKS } from './constants'

export function AboutAndReportDropdown({ className }: { className?: string }) {
  const { t } = useI18n()

  return (
    <MenuDropdown className={className} title={t('aboutAndReport')}>
      <MenuItemHeader>{t('about')}</MenuItemHeader>

      {ABOUT_LINKS.map(({ label, link }) => (
        <MenuItemLink key={label} to={link}>
          {t(label)}
        </MenuItemLink>
      ))}

      <MenuItemHeader>{t('report')}</MenuItemHeader>

      {REPORT_LINKS.map(({ label, link }) => (
        <MenuItemLink key={label} to={link}>
          {t(label)}
        </MenuItemLink>
      ))}
    </MenuDropdown>
  )
}
