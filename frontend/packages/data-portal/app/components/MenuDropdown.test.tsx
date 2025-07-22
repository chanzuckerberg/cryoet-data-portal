import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { MenuDropdown, MenuDropdownSection } from './MenuDropdown'

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

  it('should support different variants', () => {
    const { rerender } = render(
      <MenuDropdown variant="standard" title="Standard Menu">
        <div>Test</div>
      </MenuDropdown>,
    )

    expect(screen.getByRole('button')).toHaveClass('!p-0')

    rerender(
      <MenuDropdown variant="outlined" title="Standard Menu">
        <div>Test</div>
      </MenuDropdown>,
    )
    expect(screen.getByRole('button')).toHaveClass('rounded-full')
  })

  it('should render custom button content if no title provided', () => {
    render(
      <MenuDropdown
        buttonElement={
          <div>
            <button>Custom Button</button>
          </div>
        }
      >
        <div>Test Content</div>
      </MenuDropdown>,
    )

    expect(screen.getByText('Custom Button')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <MenuDropdown className="custom-class" title="Custom Class Menu">
        <div>Test</div>
      </MenuDropdown>,
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })
})

describe('<MenuDropdownSection />', () => {
  it('should render title and children', () => {
    render(
      <MenuDropdownSection title="Section Title">
        <div>Section Content</div>
      </MenuDropdownSection>,
    )

    expect(screen.getByText('Section Title')).toBeInTheDocument()
    expect(screen.getByText('Section Content')).toBeInTheDocument()
  })

  it('should render without title', () => {
    render(
      <MenuDropdownSection>
        <div>Section Content</div>
      </MenuDropdownSection>,
    )

    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    expect(screen.getByText('Section Content')).toBeInTheDocument()
  })
})
