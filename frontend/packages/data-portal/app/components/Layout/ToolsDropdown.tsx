import { MenuDropdown } from 'app/components/MenuDropdown'
import { MenuItemLink } from 'app/components/MenuItemLink'
import { useI18n } from 'app/hooks/useI18n'

import { TOOLS_LINKS } from './constants'

export function ToolsDropdown({ className }: { className?: string }) {
  const { t } = useI18n()
  return (
    <MenuDropdown className={className} title={t('tools')}>
      {TOOLS_LINKS.map(({ label, link }) => (
        <MenuItemLink key={label} to={link}>
          {t(label)}
        </MenuItemLink>
      ))}
    </MenuDropdown>
  )
}
