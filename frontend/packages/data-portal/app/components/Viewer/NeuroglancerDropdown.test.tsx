import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  NeuroglancerDropdown,
  NeuroglancerDropdownOption,
} from './NeuroglancerDropdown'

// Top level custom dropdown functionality mostly covered in MenuDropdown tests
describe('<NeuroglancerDropdown />', () => {
  it('should render with title and children', async () => {
    render(
      <NeuroglancerDropdown title="Dropdown Title">
        <div>Dropdown Content</div>
      </NeuroglancerDropdown>,
    )

    expect(screen.getByText('Dropdown Title')).toBeInTheDocument()
    expect(screen.queryByText('Dropdown Content')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button'))

    expect(screen.queryByText('Dropdown Content')).toBeVisible()
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
    const { container } = render(
      <NeuroglancerDropdownOption selected>
        Selected Option
      </NeuroglancerDropdownOption>,
    )

    expect(container.querySelector('svg')).toBeInTheDocument() // eslint-disable-line testing-library/no-node-access, testing-library/no-container
    expect(screen.getByText('Selected Option')).toHaveClass('font-semibold')
  })

  it('should not show check icon when not selected', () => {
    const { container } = render(
      <NeuroglancerDropdownOption>
        Unselected Option
      </NeuroglancerDropdownOption>,
    )

    expect(container.querySelector('svg')).toBeNull() // eslint-disable-line testing-library/no-node-access, testing-library/no-container
    expect(screen.getByText('Unselected Option')).not.toHaveClass(
      'font-semibold',
    )
  })
})
