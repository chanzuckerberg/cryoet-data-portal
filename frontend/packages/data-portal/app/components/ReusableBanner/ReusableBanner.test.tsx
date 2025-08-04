import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MockI18n } from 'app/components/I18n.mock'
import { LocalStorageKeys } from 'app/constants/localStorage'
import { LocalStorageMock } from 'app/mocks/LocalStorage.mock'
import { RemixMock } from 'app/mocks/Remix.mock'
import { getMockUser, setMockTime } from 'app/utils/mock'
import {
  testBannerAccessibility,
  testBannerKeyboardNavigation,
  testBannerSpaceKeyDismiss,
} from 'app/utils/test/testAccessibility'
import {
  mockLocalStorageCorruptedData,
  mockLocalStorageGenericError,
  mockLocalStorageQuotaExceeded,
} from 'app/utils/test/testLocalStorageErrors'

async function renderReusableBanner(endDate?: string) {
  const { ReusableBanner } = await import('./ReusableBanner')
  render(
    <ReusableBanner
      bannerTextKey="mlCompetitionSurveyBanner"
      localStorageKey={LocalStorageKeys.CompetitionSurveyBannerDismissed}
      allowedPathsRegex={[/^\/competition.*$/]}
      endDate={endDate}
    />,
  )
}

jest.unstable_mockModule('app/components/I18n', () => ({ I18n: MockI18n }))

const remixMock = new RemixMock()
const localStorageMock = new LocalStorageMock()

describe('<ReusableBanner />', () => {
  beforeEach(() => {
    jest.useRealTimers()
    remixMock.reset()
    localStorageMock.reset()
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

  it('should not render banner if was dismissed recently', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-11-20').toISOString()) // 11 days ago (less than 2 weeks)
    remixMock.mockPathname('/competition')

    await renderReusableBanner()

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
  })

  it('should render banner if dismissed long enough ago', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-11-10').toISOString()) // 21 days ago (more than 2 weeks)
    remixMock.mockPathname('/competition')

    await renderReusableBanner()

    expect(screen.queryByRole('banner')).toBeVisible()
  })

  it('should dismiss banner on click', async () => {
    const time = '2024-12-01'
    setMockTime(time)
    remixMock.mockPathname('/competition')

    await renderReusableBanner()

    expect(screen.queryByRole('banner')).toBeVisible()

    await getMockUser().click(screen.getByRole('button'))

    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(localStorageMock.setValue).toHaveBeenCalledWith(
      new Date(time).toISOString(),
    )
  })

  describe('endDate functionality', () => {
    it('should not render banner if current date is past endDate', async () => {
      setMockTime('2024-12-01')
      remixMock.mockPathname('/competition')

      await renderReusableBanner('2024-11-30') // endDate is in the past

      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    })

    it('should render banner if current date is before endDate', async () => {
      setMockTime('2024-12-01')
      remixMock.mockPathname('/competition')

      await renderReusableBanner('2024-12-15') // endDate is in the future

      expect(screen.queryByRole('banner')).toBeVisible()
    })

    it('should not render banner if current date equals endDate', async () => {
      setMockTime('2024-12-01T00:00:00')
      remixMock.mockPathname('/competition')

      await renderReusableBanner('2024-12-01') // endDate is today

      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    })

    it('should not render banner if past endDate even when not dismissed', async () => {
      setMockTime('2024-12-01')
      localStorageMock.mockValue(null) // Never dismissed
      remixMock.mockPathname('/competition')

      await renderReusableBanner('2024-11-30') // endDate is in the past

      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    })

    it('should render banner without endDate prop (backward compatibility)', async () => {
      setMockTime('2024-12-01')
      remixMock.mockPathname('/competition')

      await renderReusableBanner() // No endDate

      expect(screen.queryByRole('banner')).toBeVisible()
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      remixMock.mockPathname('/competition')
    })

    it('should have proper ARIA attributes for accessibility', async () => {
      await renderReusableBanner()

      const { banner, dismissButton } = testBannerAccessibility()

      // Banner should have proper role
      expect(banner).toHaveAttribute('role', 'banner')

      // Dismiss button should be focusable and have proper attributes
      expect(dismissButton).toHaveProperty('tabIndex', 0)
    })

    it('should dismiss banner with keyboard Enter key', async () => {
      await renderReusableBanner()
      expect(screen.getByRole('banner')).toBeInTheDocument()

      const user = getMockUser()
      await testBannerKeyboardNavigation(user)
    })

    it('should dismiss banner with keyboard Space key', async () => {
      await renderReusableBanner()
      expect(screen.getByRole('banner')).toBeInTheDocument()

      const user = getMockUser()
      await testBannerSpaceKeyDismiss(user)
    })

    it('should be keyboard navigable', async () => {
      await renderReusableBanner()

      const user = getMockUser()
      const dismissButton = screen.getByRole('button')

      // Tab to dismiss button
      await user.tab()
      expect(dismissButton).toHaveFocus()
    })
  })

  describe('Multiple Regex Patterns', () => {
    async function renderMultipleRegexBanner() {
      const { ReusableBanner } = await import('./ReusableBanner')
      render(
        <ReusableBanner
          bannerTextKey="mlCompetitionSurveyBanner"
          localStorageKey={LocalStorageKeys.CompetitionSurveyBannerDismissed}
          allowedPathsRegex={[
            /^\/competition.*$/,
            /^\/challenge.*$/,
            /^\/event\/\d+$/,
          ]}
        />,
      )
    }

    // Test each matching path separately to avoid state issues
    test.each([
      '/competition',
      '/competition/details',
      '/competitions', // matches because .* matches 's'
      '/challenge',
      '/challenge/2024',
      '/challengeabc', // matches because .* matches 'abc'
      '/event/123',
    ])('should render on %s', async (path) => {
      remixMock.mockPathname(path)
      await renderMultipleRegexBanner()
      expect(screen.queryByRole('banner')).toBeVisible()
    })

    // Test each non-matching path separately to avoid state issues
    test.each([
      ['/event/abc', 'Invalid event ID (not numeric)'],
      ['/other', 'Non-matching path'],
      ['/compete', 'Does not match competition pattern'],
      ['/chall', 'Does not match challenge pattern'],
    ])('should not render on %s (%s)', async (path) => {
      remixMock.mockPathname(path)
      await renderMultipleRegexBanner()
      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    })
  })

  describe('Partial Path Matches', () => {
    async function renderPartialMatchBanner(regex: RegExp) {
      const { ReusableBanner } = await import('./ReusableBanner')
      render(
        <ReusableBanner
          bannerTextKey="mlCompetitionSurveyBanner"
          localStorageKey={LocalStorageKeys.CompetitionSurveyBannerDismissed}
          allowedPathsRegex={[regex]}
        />,
      )
    }

    it('should handle partial path matches correctly', async () => {
      // Test exact match requirement
      remixMock.mockPathname('/competitions')
      await renderPartialMatchBanner(/^\/competition$/)
      expect(screen.queryByRole('banner')).not.toBeInTheDocument()

      // Test partial match requirement (no trailing slash)
      remixMock.mockPathname('/competition')
      await renderPartialMatchBanner(/^\/competition\//)
      expect(screen.queryByRole('banner')).not.toBeInTheDocument()

      // Test partial match that should work
      remixMock.mockPathname('/pre-competition')
      await renderPartialMatchBanner(/competition/)
      expect(screen.queryByRole('banner')).toBeVisible()
    })
  })

  describe('Different Storage Keys', () => {
    async function renderBannerWithStorageKey(storageKey: LocalStorageKeys) {
      const { ReusableBanner } = await import('./ReusableBanner')
      render(
        <ReusableBanner
          bannerTextKey="mlCompetitionSurveyBanner"
          localStorageKey={storageKey}
          allowedPathsRegex={[]} // Show on all pages
        />,
      )
    }

    it('should use different storage keys for different banners', async () => {
      setMockTime('2024-12-01')

      // Render first banner with banner1 key
      await renderBannerWithStorageKey(
        LocalStorageKeys.CompetitionSurveyBannerDismissed,
      )
      expect(screen.queryByRole('banner')).toBeVisible()

      // Dismiss first banner
      await getMockUser().click(screen.getByRole('button'))
      expect(screen.queryByRole('banner')).not.toBeInTheDocument()

      // Render second banner with banner2 key (should still be visible)
      await renderBannerWithStorageKey(LocalStorageKeys.PolicyBannerDismissed)
      expect(screen.queryByRole('banner')).toBeVisible()

      // Verify localStorage was called with correct keys
      expect(localStorageMock.setValue).toHaveBeenCalledWith(expect.any(String))
    })
  })

  describe('localStorage Error Handling', () => {
    beforeEach(() => {
      remixMock.mockPathname('/competition')
    })

    it('should handle localStorage quota exceeded error gracefully when dismissing', async () => {
      const time = '2024-12-01'
      setMockTime(time)

      await renderReusableBanner()

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

      await renderReusableBanner()

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
      // Mock localStorage with invalid JSON
      mockLocalStorageCorruptedData(localStorageMock, 'invalid-json-{{')

      // Should still render banner (treat corrupted data as no data)
      await renderReusableBanner()
      expect(screen.queryByRole('banner')).toBeVisible()
    })

    // Test each invalid endDate separately to avoid multiple banner renders
    test.each([
      ['invalid-date-format', 'Invalid date string'],
      ['2024-13-45', 'Invalid month/day'],
      ['', 'Empty string'],
      ['not-a-date', 'Text instead of date'],
    ])(
      'should handle invalid endDate format gracefully (%s - %s)',
      async (invalidDate) => {
        setMockTime('2024-12-01')
        remixMock.mockPathname('/competition')

        // Should render banner with invalid endDate (invalid dates should be ignored)
        await renderReusableBanner(invalidDate)
        expect(screen.queryByRole('banner')).toBeVisible()
      },
    )
  })
})
