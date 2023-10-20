import { MenuDropdown } from 'app/components/MenuDropdown'
import { MenuItemHeader } from 'app/components/MenuItemHeader'
import { MenuItemLink } from 'app/components/MenuItemLink'
import { i18n } from 'app/i18n'

export function AboutAndHelpDropdown({ className }: { className?: string }) {
  return (
    <MenuDropdown className={className} title={i18n.aboutAndHelp}>
      <MenuItemHeader>{i18n.about}</MenuItemHeader>

      <MenuItemLink to="/faq">{i18n.faq}</MenuItemLink>
      <MenuItemLink to="/license">{i18n.license}</MenuItemLink>
      <MenuItemLink to="/privacy">{i18n.privacyPolicy}</MenuItemLink>
      <MenuItemLink to="/terms" divider>
        {i18n.termsOfUse}
      </MenuItemLink>

      <MenuItemHeader>{i18n.helpAndReport}</MenuItemHeader>

      <MenuItemLink to="https://chanzuckerberg.github.io/cryoet-data-portal/">
        {i18n.goToDocs}
      </MenuItemLink>

      <MenuItemLink to="https://github.com/chanzuckerberg/cryoet-data-portal/issues">
        {i18n.api}
      </MenuItemLink>

      <MenuItemLink to="https://example.com">
        {i18n.submitFeedback}
      </MenuItemLink>
    </MenuDropdown>
  )
}
