import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MockI18n } from 'app/components/I18n.mock'
import { LocalStorageMock } from 'app/mocks/LocalStorage.mock'
import { RemixMock } from 'app/mocks/Remix.mock'
import { getMockUser, setMockTime } from 'app/utils/mock'

async function renderMlChallengeBanner() {
  const { MLChallengeBanner } = await import('./MLChallengeBanner')
  render(<MLChallengeBanner />)
}

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const remixMock = new RemixMock()
const localStorageMock = new LocalStorageMock()

describe('<MLChallengeBanner />', () => {
  beforeEach(() => {
    jest.useRealTimers()
    localStorageMock.reset()
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

  it('should render challenge began message', async () => {
    setMockTime('2024-12-01')

    await renderMlChallengeBanner()
    expect(screen.getByText('mlCompetitionHasBegun')).toBeVisible()
  })

  it('should render challenge ending message', async () => {
    setMockTime('2025-01-30')

    await renderMlChallengeBanner()
    expect(screen.getByText('mlCompetitionEnding')).toBeVisible()
  })

  it('should render challenge ended message', async () => {
    setMockTime('2025-02-07')

    await renderMlChallengeBanner()
    expect(screen.getByText('mlCompetitionEnded')).toBeVisible()
  })

  it('should not render banner if was dismissed', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue('mlCompetitionHasBegun')

    await renderMlChallengeBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should render banner if last dismissed was previous state', async () => {
    setMockTime('2025-01-30')
    localStorageMock.mockValue('mlCompetitionHasBegun')

    await renderMlChallengeBanner()
    expect(screen.getByRole('banner')).toBeVisible()
  })

  it('should dismiss banner on click', async () => {
    setMockTime('2024-12-01')

    await renderMlChallengeBanner()
    await getMockUser().click(screen.getByRole('button'))

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(localStorageMock.setValue).toHaveBeenCalledWith(
      'mlCompetitionHasBegun',
    )
  })
})
