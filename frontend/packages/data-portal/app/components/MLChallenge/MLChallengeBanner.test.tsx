import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MockI18n } from 'app/components/I18n.mock'
import { RemixMock } from 'app/mocks/Remix.mock'
import { getMockUser } from 'app/utils/mock'

async function renderMlChallengeBanner() {
  const { MLChallengeBanner } = await import('./MLChallengeBanner')
  render(<MLChallengeBanner />)
}

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const remixMock = new RemixMock()

describe('<MLChallengeBanner />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    remixMock.reset()
  })

  const paths = ['/', '/browse-data/datasets', '/browse-data/depositions']

  paths.forEach((pathname) => {
    it(`should render on ${pathname}`, async () => {
      remixMock.mockPathname(pathname)
      await renderMlChallengeBanner()
      expect(screen.queryByRole('banner')).toBeVisible()
    })
  })

  it('should not render on blocked pages', async () => {
    remixMock.mockPathname('/competition')
    await renderMlChallengeBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should render challenge ending message', async () => {
    await renderMlChallengeBanner()
    expect(screen.getByText('mlCompetitionIsClosingSoon')).toBeVisible()
  })

  it('should not render banner if was dismissed', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('true')
    await renderMlChallengeBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should dismiss banner on click', async () => {
    jest.spyOn(Storage.prototype, 'setItem')
    await renderMlChallengeBanner()
    expect(screen.queryByRole('banner')).toBeVisible()
    await getMockUser().click(screen.getByRole('button'))
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(localStorage.setItem).toHaveBeenCalledWith('true')
  })
})
