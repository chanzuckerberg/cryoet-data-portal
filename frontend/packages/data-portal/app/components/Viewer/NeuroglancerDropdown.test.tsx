import { render, screen } from '@testing-library/react'
import { jest } from '@jest/globals'
import {
  NeuroglancerDropdownOption,
  NeuroglancerDropdown,
} from './NeuroglancerDropdown'
import userEvent from '@testing-library/user-event'

// Top level custom dropdown functionality mostly covered in MenuDropdown tests
describe('<NeuroglancerDropdown />', () => {
  it('should render with title and children', () => {
    render(
      <NeuroglancerDropdown title="Dropdown Title">
        <div>Dropdown Content</div>
      </NeuroglancerDropdown>,
    )

    expect(screen.getByText('Dropdown Title')).toBeInTheDocument()
    expect(screen.getByText('Dropdown Content')).toBeInTheDocument()
  })
})

describe('<NeuroglancerDropdownOption />', () => {
  it('should render children and handle clicks', async () => {
    const handleClick = jest.fn()
    render(
      <NeuroglancerDropdownOption onSelect={handleClick}>
        Option Text
      </NeuroglancerDropdownOption>,
    )

    const option = screen.getByText('Option Text')
    await userEvent.click(option)
    expect(handleClick).toHaveBeenCalled()
  })

  it('should show check icon when selected', () => {
    render(
      <NeuroglancerDropdownOption selected>
        Selected Option
      </NeuroglancerDropdownOption>,
    )

    const icon = screen
      .getByText('Selected Option')
      .closest('li')
      ?.querySelector('svg')

    expect(icon).toBeInTheDocument()
    expect(screen.getByText('Selected Option')).toHaveClass('font-semibold')
  })

  it('should not show check icon when not selected', () => {
    render(
      <NeuroglancerDropdownOption>
        Unselected Option
      </NeuroglancerDropdownOption>,
    )

    expect(screen.queryByTestId('CheckIcon')).not.toBeInTheDocument()
    expect(screen.getByText('Unselected Option')).not.toHaveClass(
      'font-semibold',
    )
  })

  it('should pass through MenuItem props', () => {
    render(
      <NeuroglancerDropdownOption disabled>
        Disabled Option
      </NeuroglancerDropdownOption>,
    )

    const option = screen.getByText('Disabled Option')
    const menuItem = option.closest('li')

    expect(menuItem).toHaveAttribute('aria-disabled', 'true')
  })
})
