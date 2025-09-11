import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { useState } from 'react'

import { LocalStorageMock } from 'app/mocks/LocalStorage.mock'
import { RemixMock } from 'app/mocks/Remix.mock'
import { getMockUser, setMockTime } from 'app/utils/mock'

import { NeuroglancerBannerProps } from './NeuroglancerBanner'

const onStartTour = jest.fn()

// Import the component after mocking
let NeuroglancerBanner: React.ComponentType<NeuroglancerBannerProps> | null =
  null

function NeuroglancerBannerWrapper({
  initialOpen = true,
  tourInProgress = false,
}: {
  initialOpen?: boolean
  tourInProgress?: boolean
}) {
  const [open, setOpen] = useState(initialOpen)

  if (!NeuroglancerBanner) {
    return null
  }

  return (
    <NeuroglancerBanner
      onStartTour={onStartTour}
      open={open}
      setOpen={setOpen}
      tourInProgress={tourInProgress}
    />
  )
}

async function renderNeuroglancerBanner(props?: {
  initialOpen?: boolean
  tourInProgress?: boolean
}) {
  if (!NeuroglancerBanner) {
    const module = await import('./NeuroglancerBanner')
    NeuroglancerBanner = module.NeuroglancerBanner
  }
  render(<NeuroglancerBannerWrapper {...props} />)
}

function MockI18n({
  i18nKey,
  components,
}: {
  i18nKey: string
  components?: Record<string, React.ReactNode>
}) {
  if (i18nKey === 'tourBanner') {
    return <>{components?.button}</>
  }
  return <>{i18nKey}</>
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
    onStartTour.mockClear()
    NeuroglancerBanner = null // Reset the component for each test
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

    await renderNeuroglancerBanner({ initialOpen: false })
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should render banner if dismissed >= 1 weeks ago', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-11-22').toISOString())

    await renderNeuroglancerBanner()
    expect(screen.queryByRole('banner')).toBeVisible()
  })

  it('should not render banner if tour is in progress', async () => {
    await renderNeuroglancerBanner({ tourInProgress: true })
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should hide banner when tourInProgress is true even if open is true', async () => {
    await renderNeuroglancerBanner({ initialOpen: true, tourInProgress: true })
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })
})
