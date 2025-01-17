import { render, screen } from '@testing-library/react'
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
    render(
      <MenuDropdown title="menu">
        <p>content</p>
      </MenuDropdown>,
    )

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('content')).toBeVisible()
  })
})
