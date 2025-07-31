import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MockI18n } from 'app/components/I18n.mock'
import { LocalStorageMock } from 'app/mocks/LocalStorage.mock'
import { RemixMock } from 'app/mocks/Remix.mock'
import { getMockUser, setMockTime } from 'app/utils/mock'

const onStartTour = jest.fn()
async function renderNeuroglancerBanner() {
  const { NeuroglancerBanner } = await import('./NeuroglancerBanner')
  render(<NeuroglancerBanner onStartTour={onStartTour} />)
}

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const remixMock = new RemixMock()
const localStorageMock = new LocalStorageMock()

describe('<NeuroglancerBanner />', () => {
  beforeEach(() => {
    jest.useRealTimers()
    remixMock.reset()
    remixMock.mockPathname('/view/runs/123/#!')
    localStorageMock.reset()
  })

  const pages = ['/view/runs/123/#!']

  pages.forEach((pathname) => {
    it(`should render on ${pathname}`, async () => {
      remixMock.mockPathname(pathname)
      await renderNeuroglancerBanner()
      expect(screen.queryByRole('banner')).toBeVisible()
    })
  })

  it('should not render on blocked pages', async () => {
    remixMock.mockPathname('/')
    await renderNeuroglancerBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should dismiss on click of the x', async () => {
    const time = '2024-12-01'
    setMockTime(time)

    await renderNeuroglancerBanner()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2) // One for the dismiss, one for the tour
    await getMockUser().click(buttons[1])

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(localStorageMock.setValue).toHaveBeenCalledWith(
      new Date(time).toISOString(),
    )
    expect(onStartTour).not.toHaveBeenCalled()
  })

  it('should dismiss and start tour on click of the tour button', async () => {
    const time = '2024-12-01'
    setMockTime(time)

    await renderNeuroglancerBanner()
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2) // One for the dismiss, one for the tour
    await getMockUser().click(buttons[0])

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(localStorageMock.setValue).toHaveBeenCalledWith(
      new Date(time).toISOString(),
    )
    expect(onStartTour).toHaveBeenCalledTimes(1)
  })

  it('should not render banner if previously dismissed', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-11-25').toISOString())

    await renderNeuroglancerBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should render banner if dismissed >= 1 weeks ago', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-11-22').toISOString())

    await renderNeuroglancerBanner()
    expect(screen.queryByRole('banner')).toBeVisible()
  })
})
