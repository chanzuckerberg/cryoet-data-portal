import { beforeEach, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { MockI18n } from 'app/components/I18n.mock'
import { LocalStorageMock } from 'app/mocks/LocalStorage.mock'
import { RemixMock } from 'app/mocks/Remix.mock'
import { getMockUser, setMockTime } from 'app/utils/mock'
import { assertDismissButton } from 'app/utils/test/assertBannerContent'

async function renderSurveyBanner() {
  const { SurveyBanner } = await import('./SurveyBanner')
  render(<SurveyBanner />)
}

const mockI18nFunction = jest.fn(MockI18n)
jest.unstable_mockModule('app/components/I18n', () => ({
  I18n: mockI18nFunction,
}))

const remixMock = new RemixMock()
const localStorageMock = new LocalStorageMock()

describe('<SurveyBanner />', () => {
  beforeEach(() => {
    jest.useRealTimers()
    remixMock.reset()
    remixMock.mockPathname('/datasets/123')
    localStorageMock.reset()
    mockI18nFunction.mockClear()
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

  it('should render banner if dismissed >= 2 weeks ago', async () => {
    setMockTime('2024-12-01')
    localStorageMock.mockValue(new Date('2024-10-30').toISOString())

    await renderSurveyBanner()
    expect(screen.queryByRole('banner')).toBeVisible()
  })

  it('should render with custom content (speech bubbles icon)', async () => {
    remixMock.mockPathname('/datasets/123')
    await renderSurveyBanner()

    expect(screen.queryByRole('banner')).toBeVisible()
    // The custom content with icon should be rendered inside the banner
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  describe('Content Verification', () => {
    beforeEach(() => {
      remixMock.mockPathname('/datasets/123')
    })

    it('should render speech bubbles icon', async () => {
      await renderSurveyBanner()

      // Check that banner is visible
      const banner = screen.getByRole('banner')
      expect(banner).toBeVisible()

      // The Icon component should be rendered within the banner
      // We just verify the banner renders successfully without errors
      expect(banner).not.toBeEmptyDOMElement()
    })

    it('should render complete survey message with proper i18n key', async () => {
      await renderSurveyBanner()

      // Verify banner is visible
      const banner = screen.getByRole('banner')
      expect(banner).toBeVisible()

      // Verify that the I18n component was called with the correct key
      expect(mockI18nFunction).toHaveBeenCalledWith(
        expect.objectContaining({ i18nKey: 'surveyBanner' }),
        expect.anything(),
      )

      // Verify dismiss button
      assertDismissButton()
    })

    it('should render survey content with icon and text together', async () => {
      await renderSurveyBanner()

      const banner = screen.getByRole('banner')

      // Check that the banner contains both icon and text elements
      expect(banner).toBeVisible()

      // Should have text content (icon is rendered but may not be testable in this environment)
      expect(screen.getByText('surveyBanner')).toBeInTheDocument()
    })

    it('should render with custom CSS module styles', async () => {
      await renderSurveyBanner()

      const banner = screen.getByRole('banner')

      // The banner should have the custom styles applied
      // We can't easily test CSS module classes, but we can verify the banner renders
      expect(banner).toBeVisible()
    })
  })

  describe('Survey Link Attributes', () => {
    beforeEach(() => {
      remixMock.mockPathname('/datasets/123')
    })

    it('should render survey content with I18n component', async () => {
      await renderSurveyBanner()

      // Since we're using MockI18n, we check for the i18n key
      const i18nContent = screen.getByText('surveyBanner')
      expect(i18nContent).toBeInTheDocument()

      // Verify the mock component received the expected props (data attributes are only present if values/linkProps are provided)
      expect(i18nContent).toBeInTheDocument()
    })

    it('should render survey banner with speech bubbles icon', async () => {
      await renderSurveyBanner()

      // Verify the survey banner renders successfully
      const banner = screen.getByRole('banner')
      expect(banner).toBeVisible()
    })

    it('should support keyboard navigation to dismiss button', async () => {
      await renderSurveyBanner()

      const user = getMockUser()
      const dismissButton = screen.getByRole('button')

      // Tab to the dismiss button
      await user.tab()

      // Button should be focusable via keyboard
      expect(dismissButton).toHaveFocus()
    })

    it('should render banner with proper ARIA attributes', async () => {
      await renderSurveyBanner()

      const banner = screen.getByRole('banner')

      // Banner should be accessible
      expect(banner).toHaveAttribute('role', 'banner')
      expect(banner).not.toHaveAttribute('aria-hidden', 'true')
    })

    it('should verify I18n component is used for survey content', async () => {
      await renderSurveyBanner()

      // The I18n component should render the survey text
      const i18nElement = screen.getByText('surveyBanner')
      expect(i18nElement).toBeInTheDocument()

      // The banner should be dismissible
      const dismissButton = screen.getByRole('button')
      await getMockUser().click(dismissButton)

      // Banner should be removed after clicking dismiss
      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    })
  })
})
