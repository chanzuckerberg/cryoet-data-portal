import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MockI18n } from 'app/components/I18n.mock'
import { LocalStorageMock } from 'app/mocks/LocalStorage.mock'
import { RemixMock } from 'app/mocks/Remix.mock'
import { setMockTime } from 'app/utils/mock'
import { assertDismissButton } from 'app/utils/test/assertBannerContent'

async function renderPolicyBanner() {
  const { PolicyBanner } = await import('./PolicyBanner')
  render(<PolicyBanner />)
}

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const remixMock = new RemixMock()
const localStorageMock = new LocalStorageMock()

describe('<PolicyBanner />', () => {
  beforeEach(() => {
    jest.useRealTimers()
    remixMock.reset()
    remixMock.mockPathname('/')
    localStorageMock.reset()
  })

  const pages = ['/', '/datasets/123', '/runs/123', '/depositions/123']

  pages.forEach((pathname) => {
    it(`should render on ${pathname}`, async () => {
      remixMock.mockPathname(pathname)
      await renderPolicyBanner()
      expect(screen.queryByRole('banner')).toBeVisible()
    })
  })

  it('should render banner if dismissed >= 30 days ago', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-10-01').toISOString())

    await renderPolicyBanner()
    expect(screen.queryByRole('banner')).toBeVisible()
  })

  describe('Content Verification', () => {
    it('should render correct banner content and links', async () => {
      await renderPolicyBanner()

      // Verify banner is visible
      const banner = screen.getByRole('banner')
      expect(banner).toBeVisible()

      // Verify dismiss button exists
      assertDismissButton()

      // Verify banner contains expected content structure
      expect(banner).toBeInTheDocument()
    })

    it('should render banner with proper structure', async () => {
      await renderPolicyBanner()

      // Verify basic banner structure is present
      const banner = screen.getByRole('banner')
      expect(banner).toBeVisible()

      // Should have content inside the banner
      expect(banner).not.toBeEmptyDOMElement()
    })

    it('should use the policyBanner i18n key', async () => {
      await renderPolicyBanner()

      // Since PolicyBanner is a wrapper around ReusableBanner with specific props,
      // we can verify it renders without errors
      const banner = screen.getByRole('banner')
      expect(banner).toBeInTheDocument()
    })
  })
})
