import { SiteLinks } from 'app/constants/siteLinks'
import { I18nKeys } from 'app/types/i18n'

export interface NavLink {
  label: I18nKeys
  link: string
}

interface TopNavLink extends NavLink {
  isActive(pathname: string): boolean
}

// TODO: (smccanny) Remove once post competition page is live
export const TOP_LEVEL_LINKS_COMPETITION: TopNavLink[] = [
  {
    isActive: (pathname) =>
      pathname.includes('/datasets') ||
      pathname.includes('/runs') ||
      pathname.includes('/depositions'),
    label: 'browseData',
    link: SiteLinks.BROWSE_DATA_DATASETS,
  },
  {
    isActive: (pathname) => pathname === '/competition',
    label: 'competition',
    link: SiteLinks.COMPETITION,
  },
]

export const TOP_LEVEL_LINKS: TopNavLink[] = [
  {
    isActive: (pathname) =>
      pathname.includes('/datasets') ||
      pathname.includes('/runs') ||
      pathname.includes('/depositions'),
    label: 'browseData',
    link: SiteLinks.BROWSE_DATA_DATASETS,
  },
  {
    isActive: (pathname) => pathname === '/competition',
    label: 'pastCompetition',
    link: SiteLinks.COMPETITION,
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
  { label: 'faq', link: SiteLinks.FAQ },
  // {label: 'license', link: '/license'},
  { label: 'privacy', link: SiteLinks.PRIVACY },
  // {label: 'terms', link: '/terms'},
  { label: 'dataSubmissionPolicy', link: SiteLinks.DATA_SUBMISSION_POLICY },
]

const REPO = 'https://github.com/chanzuckerberg/cryoet-data-portal'

export const HELP_AND_REPORT_LINKS: NavLink[] = [
  {
    label: 'goToDocs',
    link: 'https://chanzuckerberg.github.io/cryoet-data-portal',
  },
  {
    label: 'reportIssueOnGithub',
    link: `${REPO}/issues/new?assignees=&labels=bug&projects=&template=bug.md&title=`,
  },
  {
    label: 'askOnGithub',
    link: `${REPO}/discussions`,
  },
]

export const NEUROGLANCER_HELP_LINKS: NavLink[] = [
  {
    label: 'goToNeuroglancerDocumentation',
    link: 'https://chanzuckerberg.github.io/cryoet-data-portal/stable/neuroglancer_quickstart.html#neuroglancer-quickstart',
  },
  {
    label: 'neuroglancerWalkthrough',
    link: '#',
  },
]
