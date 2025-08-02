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
