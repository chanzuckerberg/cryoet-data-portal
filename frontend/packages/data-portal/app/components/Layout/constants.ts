import { SITE_LINKS } from 'app/constants/siteLinks'
import { I18nKeys } from 'app/types/i18n'

export interface NavLink {
  label: I18nKeys
  link: string
}

interface TopNavLink extends NavLink {
  isActive?: (pathname: string) => boolean
}

export const TOP_LEVEL_LINKS: TopNavLink[] = [
  {
    isActive: (pathname) =>
      pathname.includes('/datasets') ||
      pathname.includes('/runs') ||
      pathname.includes('/depositions'),
    label: 'browseData',
    link: SITE_LINKS.BROWSE_DATA_DATASETS,
  },
  {
    isActive: (pathname) => pathname === '/competition',
    label: 'pastCompetition',
    link: SITE_LINKS.COMPETITION,
  },
  {
    label: 'documentation',
    link: SITE_LINKS.DOCUMENTATION,
  },
]

export const TOOLS_LINKS: NavLink[] = [
  {
    label: 'api',
    link: 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/python-api.html',
  },
  {
    label: 'napariPlugin',
    link: 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/cryoet_data_portal_docsite_napari.html',
  },
]

export const ABOUT_LINKS: NavLink[] = [
  { label: 'faq', link: SITE_LINKS.FAQ },
  // {label: 'license', link: '/license'},
  { label: 'privacy', link: SITE_LINKS.PRIVACY },
  // {label: 'terms', link: '/terms'},
  { label: 'dataSubmissionPolicy', link: SITE_LINKS.DATA_SUBMISSION_POLICY },
]

const REPO = 'https://github.com/chanzuckerberg/cryoet-data-portal'

export const REPORT_LINKS: NavLink[] = [
  {
    label: 'reportIssueOnGithub',
    link: `${REPO}/issues/new?assignees=&labels=bug&projects=&template=bug.md&title=`,
  },
  {
    label: 'askOnGithub',
    link: `${REPO}/discussions`,
  },
]

export const NEUROGLANCER_DOC_LINK =
  'https://chanzuckerberg.github.io/cryoet-data-portal/stable/neuroglancer_quickstart.html#neuroglancer-quickstart'
