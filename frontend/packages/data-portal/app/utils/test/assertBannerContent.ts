import { screen } from '@testing-library/react'

interface ExpectedLink {
  text: string
  href: string
  target?: string
  rel?: string
}

/**
 * Assert that banner contains expected text content
 */
function assertBannerText(expectedTexts: string[]) {
  expectedTexts.forEach((text) => {
    expect(screen.getByText(text)).toBeInTheDocument()
  })
}

/**
 * Assert that banner contains expected links with correct attributes
 */
function assertBannerLinks(expectedLinks: ExpectedLink[]) {
  expectedLinks.forEach((expectedLink) => {
    const link = screen.getByRole('link', {
      name: new RegExp(expectedLink.text, 'i'),
    })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', expectedLink.href)

    if (expectedLink.target) {
      expect(link).toHaveAttribute('target', expectedLink.target)
    }

    if (expectedLink.rel) {
      expect(link).toHaveAttribute('rel', expectedLink.rel)
    }
  })
}

/**
 * Assert that banner has a dismiss button with correct attributes
 */
function assertDismissButton(expectedAriaLabel = 'Close') {
  const dismissButton = screen.getByRole('button')
  expect(dismissButton).toBeInTheDocument()
  expect(dismissButton).toHaveAttribute('aria-label', expectedAriaLabel)
}

/**
 * Comprehensive banner content verification
 * Tests text, links, and dismiss button in one function
 */
function assertBannerContent(
  expectedTexts: string[],
  expectedLinks: ExpectedLink[],
  dismissButtonLabel?: string,
) {
  // Verify banner is visible
  const banner = screen.getByRole('banner')
  expect(banner).toBeVisible()

  // Verify text content
  assertBannerText(expectedTexts)

  // Verify links
  if (expectedLinks.length > 0) {
    assertBannerLinks(expectedLinks)
  }

  // Verify dismiss button
  assertDismissButton(dismissButtonLabel)
}

/**
 * Assert that links open in new tab with security attributes
 * Common pattern for external links
 */
function assertExternalLinkSecurity(linkText: string, expectedHref: string) {
  const link = screen.getByRole('link', { name: new RegExp(linkText, 'i') })

  expect(link).toHaveAttribute('href', expectedHref)
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
}

/**
 * Assert that banner contains specific icons by test id or aria-label
 */
function assertBannerIcon(iconTestId?: string, iconAriaLabel?: string) {
  if (iconTestId) {
    expect(screen.getByTestId(iconTestId)).toBeInTheDocument()
  }

  if (iconAriaLabel) {
    expect(screen.getByLabelText(iconAriaLabel)).toBeInTheDocument()
  }
}

/**
 * Helper to verify translated content using i18n keys
 * Useful when testing components that use I18n component
 */
function assertTranslatedContent(
  translationKey: string,
  mockI18n: jest.MockedFunction<(props: { i18nKey: string }) => JSX.Element>,
) {
  // Verify that i18n was called with correct key
  expect(mockI18n).toHaveBeenCalledWith(
    expect.objectContaining({ i18nKey: translationKey }),
  )
}
