import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MockI18n } from 'app/components/I18n.mock'
import { LocalStorageMock } from 'app/mocks/LocalStorage.mock'
import { RemixMock } from 'app/mocks/Remix.mock'
import { getMockUser, setMockTime } from 'app/utils/mock'

async function renderSurveyBanner() {
  const { SurveyBanner } = await import('./SurveyBanner')
  render(<SurveyBanner />)
}

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const remixMock = new RemixMock()
const localStorageMock = new LocalStorageMock()

describe('<SurveyBanner />', () => {
  beforeEach(() => {
    jest.useRealTimers()
    remixMock.reset()
    remixMock.mockPathname('/datasets/123')
    localStorageMock.reset()
  })

  const pages = ['/datasets/123', '/runs/123', '/depositions/123']

  pages.forEach((pathname) => {
    it(`should render on ${pathname}`, async () => {
      remixMock.mockPathname(pathname)
      await renderSurveyBanner()
      expect(screen.queryByRole('banner')).toBeVisible()
    })
  })

  it('should not render on blocked pages', async () => {
    remixMock.mockPathname('/')
    await renderSurveyBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should dismiss on click', async () => {
    const time = '2024-12-01'
    setMockTime(time)

    await renderSurveyBanner()
    await getMockUser().click(screen.getByRole('button'))

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(localStorageMock.setValue).toHaveBeenCalledWith(
      new Date(time).toISOString(),
    )
  })

  it('should not render banner if previously dismissed', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-11-25').toISOString())

    await renderSurveyBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should render banner if dismissed >= 2 weeks ago', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-10-30').toISOString())

    await renderSurveyBanner()
    expect(screen.queryByRole('banner')).toBeVisible()
  })
})
