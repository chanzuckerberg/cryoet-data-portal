import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MockI18n } from 'app/components/I18n.mock'
import { LocalStorageKeys } from 'app/constants/localStorage'
import { RemixMock } from 'app/mocks/Remix.mock'
import { getMockUser } from 'app/utils/mock'

async function renderReusableBanner() {
  const { ReusableBanner } = await import('./ReusableBanner')
  render(
    <ReusableBanner
      bannerTextKey="mlCompetitionSurveyBanner"
      localStorageKey={LocalStorageKeys.CompetitionSurveyBannerDismissed}
      allowedPathsRegex={[/^\/competition.*$/]}
    />,
  )
}

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const remixMock = new RemixMock()

describe('<ReusableBanner />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    remixMock.reset()
  })

  const paths = ['/competition']

  paths.forEach((pathname) => {
    it(`should render on ${pathname}`, async () => {
      remixMock.mockPathname(pathname)

      await renderReusableBanner()

      expect(screen.queryByRole('banner')).toBeVisible()
    })
  })

  it('should not render on blocked pages', async () => {
    remixMock.mockPathname('/')

    await renderReusableBanner()

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should not render banner if was dismissed', async () => {
    remixMock.mockPathname('/competition')
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('true')

    await renderReusableBanner()

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should dismiss banner on click', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null)
    jest.spyOn(Storage.prototype, 'setItem')
    remixMock.mockPathname('/competition')
    await renderReusableBanner()

    expect(screen.queryByRole('banner')).toBeVisible()

    await getMockUser().click(screen.getByRole('button'))

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'deprecation-dismissed',
      'true',
    )
  })
})
