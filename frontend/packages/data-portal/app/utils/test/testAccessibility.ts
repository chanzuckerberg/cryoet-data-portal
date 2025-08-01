import { screen } from '@testing-library/react'

/**
 * Helper function to test banner accessibility features
 * Verifies ARIA attributes, role, and keyboard navigation capabilities
 */
export function testBannerAccessibility(bannerElement?: HTMLElement) {
  const banner = bannerElement || screen.getByRole('banner')

  // Check for proper banner role
  expect(banner).toBeInTheDocument()
  expect(banner).toHaveAttribute('role', 'banner')

  // Find dismiss button within the banner
  const dismissButton = screen.getByRole('button')
  expect(dismissButton).toBeInTheDocument()

  // Check that button is focusable
  expect(dismissButton).toHaveProperty('tabIndex', 0)

  return {
    banner,
    dismissButton,
  }
}

/**
 * Verifies that banner has proper ARIA attributes
 */
function assertBannerARIA(bannerElement: HTMLElement, expectedLabel?: string) {
  // Banner should be visible to screen readers
  expect(bannerElement).not.toHaveAttribute('aria-hidden', 'true')

  // If an expected label is provided, verify it matches
  if (expectedLabel) {
    expect(bannerElement).toHaveAttribute('aria-label', expectedLabel)
  } else {
    // Verify aria-label exists (it should have some value)
    const ariaLabel = bannerElement.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
  }
}

/**
 * Verifies that dismiss button has proper ARIA attributes
 */
function assertDismissButtonARIA(
  buttonElement: HTMLElement,
  expectedLabel?: string,
) {
  const defaultLabel = expectedLabel || 'Dismiss banner'
  expect(buttonElement).toHaveAttribute('aria-label', defaultLabel)
}

/**
 * Tests keyboard navigation for banner components
 */
export async function testBannerKeyboardNavigation(userEvent: {
  keyboard: (keys: string) => Promise<void>
}) {
  const dismissButton = screen.getByRole('button')

  // Test that button can be focused
  dismissButton.focus()
  expect(dismissButton).toHaveFocus()

  // Test Enter key
  await userEvent.keyboard('{Enter}')
  expect(screen.queryByRole('banner')).not.toBeInTheDocument()
}

/**
 * Tests Space key activation for dismiss button
 */
export async function testBannerSpaceKeyDismiss(userEvent: {
  keyboard: (keys: string) => Promise<void>
}) {
  const dismissButton = screen.getByRole('button')

  dismissButton.focus()
  expect(dismissButton).toHaveFocus()

  // Test Space key
  await userEvent.keyboard(' ')
  expect(screen.queryByRole('banner')).not.toBeInTheDocument()
}
