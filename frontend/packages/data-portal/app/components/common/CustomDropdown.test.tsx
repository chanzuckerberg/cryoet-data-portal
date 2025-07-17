import { render, screen } from '@testing-library/react'
import { jest } from '@jest/globals'
import { CustomDropdownSection, CustomDropdownOption } from './CustomDropdown'
import userEvent from '@testing-library/user-event'

// Top level custom dropdown functionality covered in MenuDropdown tests
describe('<CustomDropdownSection />', () => {
  it('should render title and children', () => {
    render(
      <CustomDropdownSection title="Section Title">
        <div>Section Content</div>
      </CustomDropdownSection>,
    )

    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByText('Section Content')).toBeInTheDocument()
  })

  it('should render without title', () => {
    render(
      <CustomDropdownSection title="">
        <div>Section Content</div>
      </CustomDropdownSection>,
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Section Content')).toBeInTheDocument()
  })
})

describe('<CustomDropdownOption />', () => {
  it('should render children and handle clicks', async () => {
    const handleClick = jest.fn()
    render(
      <CustomDropdownOption onSelect={handleClick}>
        Option Text
      </CustomDropdownOption>,
    )

    const option = screen.getByText('Option Text')
    await userEvent.click(option)
    expect(handleClick).toHaveBeenCalled()
  })

  it('should show check icon when selected', () => {
    render(
      <CustomDropdownOption selected>Selected Option</CustomDropdownOption>,
    )

    const icon = screen
      .getByText('Selected Option')
      .closest('li')
      ?.querySelector('svg')

    expect(icon).toBeInTheDocument()
    expect(screen.getByText('Selected Option')).toHaveClass('font-semibold')
  })

  it('should not show check icon when not selected', () => {
    render(<CustomDropdownOption>Unselected Option</CustomDropdownOption>)

    expect(screen.queryByTestId('CheckIcon')).not.toBeInTheDocument()
    expect(screen.getByText('Unselected Option')).not.toHaveClass(
      'font-semibold',
    )
  })

  it('should pass through MenuItem props', () => {
    render(
      <CustomDropdownOption disabled>Disabled Option</CustomDropdownOption>,
    )

    const option = screen.getByText('Disabled Option')
    const menuItem = option.closest('li')

    expect(menuItem).toHaveAttribute('aria-disabled', 'true')
  })
})
