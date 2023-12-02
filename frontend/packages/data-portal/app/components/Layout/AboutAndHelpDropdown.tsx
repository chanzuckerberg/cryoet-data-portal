import { MenuDropdown } from 'app/components/MenuDropdown'
import { MenuItemHeader } from 'app/components/MenuItemHeader'
import { MenuItemLink } from 'app/components/MenuItemLink'
import { i18n } from 'app/i18n'

const REPO = 'https://github.com/chanzuckerberg/cryoet-data-portal'

export function AboutAndHelpDropdown({ className }: { className?: string }) {
  return (
    <MenuDropdown className={className} title={i18n.aboutAndHelp}>
      <MenuItemHeader>{i18n.about}</MenuItemHeader>

      <MenuItemLink to="/faq">{i18n.faq}</MenuItemLink>
      {/* <MenuItemLink to="/license">{i18n.license}</MenuItemLink> */}
      <MenuItemLink to="/privacy">{i18n.privacyPolicy}</MenuItemLink>
      {/* <MenuItemLink to="/terms" divider> */}
      <MenuItemLink to="/data-submission-policy">
        {i18n.dataSubmissionPolicy}
      </MenuItemLink>
      {/* <MenuItemLink to="/terms" divider>
        {i18n.termsOfUse}
      </MenuItemLink> */}

      <MenuItemHeader>{i18n.helpAndReport}</MenuItemHeader>

      <MenuItemLink to="https://chanzuckerberg.github.io/cryoet-data-portal">
        {i18n.goToDocs}
      </MenuItemLink>

      <MenuItemLink to={`${REPO}/issues`}>
        {i18n.reportIssueOnGithub}
      </MenuItemLink>

      <MenuItemLink to={`${REPO}/discussions`}>{i18n.askOnGitHub}</MenuItemLink>
    </MenuDropdown>
  )
}
