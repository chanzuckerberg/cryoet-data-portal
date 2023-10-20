/**
 * Temporary solution for organizing strings in the codebase until a blocking
 * issue in `remix-i18next` is resolved:
 * https://github.com/sergiodxa/remix-i18next/issues/143
 */
export const i18n = {
  about: 'About',
  aboutAndHelp: 'About & Help',
  api: 'API',
  browseData: 'Browse Data',
  cookiePolicy: 'Cookie Policy',
  datasetCount: (count: number, max: number) => `${count} of ${max} datasets`,
  datasets: 'Datasets',
  documentation: 'Documentation',
  faq: 'FAQ',
  github: 'GitHub',
  goToDocs: 'Go to Documentation',
  helpAndReport: 'Help & Report',
  license: 'License',
  napariPlugin: 'napari Plugin',
  privacy: 'Privacy',
  privacyPolicy: 'Privacy Policy',
  reportIssueOnGithub: 'Report Issue on GitHub',
  runs: 'Runs',
  search: 'Search',
  submitFeedback: 'Submit Feedback',
  terms: 'Terms',
  termsOfUse: 'Terms of Use',
  title: 'CryoET Data Portal',
  tools: 'Tools',
}
