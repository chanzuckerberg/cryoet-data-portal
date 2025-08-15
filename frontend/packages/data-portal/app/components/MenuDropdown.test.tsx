import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MenuDropdown } from './MenuDropdown'

describe('<MenuDropdown />', () => {
  it('should hide menu initially', () => {
    render(
      <MenuDropdown title="menu">
        <p>content</p>
      </MenuDropdown>,
    )

    expect(screen.queryByText('content')).not.toBeInTheDocument()
  })

  it('should open menu on click', async () => {
    const user = userEvent.setup()
    render(
      <MenuDropdown title="menu">
        <p>content</p>
      </MenuDropdown>,
    )

    await user.click(screen.getByRole('button'))

    // Wait for menu to open and content to be visible
    await waitFor(() => {
      expect(screen.queryByText('content')).toBeVisible()
    })
  })
})
