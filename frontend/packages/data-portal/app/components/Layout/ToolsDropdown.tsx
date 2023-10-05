import { MenuDropdown } from 'app/components/MenuDropdown'
import { MenuItemLink } from 'app/components/MenuItemLink'
import { i18n } from 'app/i18n'

export function ToolsDropdown({ className }: { className?: string }) {
  return (
    <MenuDropdown className={className} title={i18n.tools}>
      <MenuItemLink to="https://chanzuckerberg.github.io/cryoet-data-portal/python-api.html">
        {i18n.faq}
      </MenuItemLink>

      <MenuItemLink to="https://chanzuckerberg.github.io/cryoet-data-portal/cryoet_data_portal_docsite_napari.html">
        {i18n.napariPlugin}
      </MenuItemLink>
    </MenuDropdown>
  )
}
