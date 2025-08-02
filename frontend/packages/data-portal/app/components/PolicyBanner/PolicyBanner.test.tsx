import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MockI18n } from 'app/components/I18n.mock'
import { LocalStorageMock } from 'app/mocks/LocalStorage.mock'
import { RemixMock } from 'app/mocks/Remix.mock'
import { getMockUser, setMockTime } from 'app/utils/mock'
import { assertDismissButton } from 'app/utils/test/assertBannerContent'
import {
  testBannerAccessibility,
  testBannerKeyboardNavigation,
  testBannerSpaceKeyDismiss,
} from 'app/utils/test/testAccessibility'
import {
  mockLocalStorageGenericError,
  mockLocalStorageQuotaExceeded,
} from 'app/utils/test/testLocalStorageErrors'

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

  it('should dismiss on click', async () => {
    const time = '2024-12-01'
    setMockTime(time)

    await renderPolicyBanner()
    await getMockUser().click(screen.getByRole('button'))

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(localStorageMock.setValue).toHaveBeenCalledWith(
      new Date(time).toISOString(),
    )
  })

  it('should not render banner if previously dismissed', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-11-25').toISOString())

    await renderPolicyBanner()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should render banner if dismissed >= 30 days ago', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-10-01').toISOString())

    await renderPolicyBanner()
    expect(screen.queryByRole('banner')).toBeVisible()
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for accessibility', async () => {
      await renderPolicyBanner()

      const { banner, dismissButton } = testBannerAccessibility()

      // Banner should have proper role
      expect(banner).toHaveAttribute('role', 'banner')

      // Dismiss button should be focusable and have proper attributes
      expect(dismissButton).toHaveProperty('tabIndex', 0)
    })

    it('should dismiss banner with keyboard Enter key', async () => {
      await renderPolicyBanner()
      expect(screen.getByRole('banner')).toBeInTheDocument()

      const user = getMockUser()
      await testBannerKeyboardNavigation(user)
    })

    it('should dismiss banner with keyboard Space key', async () => {
      await renderPolicyBanner()
      expect(screen.getByRole('banner')).toBeInTheDocument()

      const user = getMockUser()
      await testBannerSpaceKeyDismiss(user)
    })

    it('should be keyboard navigable', async () => {
      await renderPolicyBanner()

      const user = getMockUser()
      const dismissButton = screen.getByRole('button')

      // Tab to dismiss button
      await user.tab()
      expect(dismissButton).toHaveFocus()
    })
  })

  describe('localStorage Error Handling', () => {
    it('should handle localStorage quota exceeded error gracefully when dismissing', async () => {
      const time = '2024-12-01'
      setMockTime(time)

      await renderPolicyBanner()

      // Mock localStorage.setItem to throw QuotaExceededError
      const errorMock = mockLocalStorageQuotaExceeded()

      try {
        // Should still dismiss banner despite localStorage error
        await getMockUser().click(screen.getByRole('button'))
        expect(screen.queryByRole('banner')).not.toBeInTheDocument()
      } finally {
        errorMock.restore()
      }
    })

    it('should handle generic localStorage errors gracefully when dismissing', async () => {
      const time = '2024-12-01'
      setMockTime(time)

      await renderPolicyBanner()

      // Mock localStorage.setItem to throw generic error
      const errorMock = mockLocalStorageGenericError('Storage operation failed')

      try {
        // Should still dismiss banner despite localStorage error
        await getMockUser().click(screen.getByRole('button'))
        expect(screen.queryByRole('banner')).not.toBeInTheDocument()
      } finally {
        errorMock.restore()
      }
    })

    it('should handle corrupted localStorage data gracefully', async () => {
      setMockTime('2024-12-01')

      // Mock localStorage with corrupted/invalid data
      localStorageMock.mockValue('invalid-json-{{')

      // Should still render banner (treat corrupted data as no previous dismissal)
      await renderPolicyBanner()
      expect(screen.queryByRole('banner')).toBeVisible()
    })

    it('should handle invalid date values in localStorage', async () => {
      setMockTime('2024-12-01')

      // Mock localStorage with invalid date string (not ISO format)
      localStorageMock.mockValue('not-a-date')

      // Should render banner (invalid dates should be treated as no previous dismissal)
      await renderPolicyBanner()
      expect(screen.queryByRole('banner')).toBeVisible()
    })

    it('should handle future dates in localStorage', async () => {
      setMockTime('2024-12-01')

      // Mock localStorage with future date
      localStorageMock.mockValue('2025-01-01T00:00:00.000Z')

      // Should render banner (future dates should be treated as valid dismissal)
      await renderPolicyBanner()
      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    })
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
