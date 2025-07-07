import { jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Select, SelectOption, SelectProps } from './Select'

const TEST_OPTIONS: SelectOption[] = Array(3)
  .fill(null)
  .map((_, idx) => ({
    key: `test${idx}`,
    value: `Value ${idx}`,
    label: `Label ${idx}`,
  }))

interface TestSelectProps
  extends Partial<Omit<SelectProps, 'activeKey' | 'activeKeys' | 'onChange'>> {
  activeKey?: string | null
  activeKeys?: string[]
  onChange?:
    | jest.Mock
    | ((key: string | null) => void)
    | ((keys: string[]) => void)
}

function renderSelect({
  activeKey = null,
  label = 'Test Label',
  onChange = jest.fn(),
  ...props
}: TestSelectProps = {}) {
  const baseProps = {
    label,
    options: TEST_OPTIONS,
    ...props,
  }

  // Default to single select props if no multiple specified
  if (props.multiple) {
    return render(
      <Select
        {...baseProps}
        multiple
        activeKeys={props.activeKeys || []}
        onChange={onChange as (keys: string[]) => void}
      />,
    )
  }

  return render(
    <Select
      {...baseProps}
      multiple={false}
      activeKey={activeKey}
      onChange={onChange as (key: string | null) => void}
    />,
  )
}

describe('<Select />', () => {
  it('should render title', () => {
    const title = 'Test Title'

    renderSelect({ title })
    expect(screen.queryByText(`${title}:`)).toBeVisible()
  })

  it('should render label', () => {
    renderSelect()
    expect(screen.queryByText('Test Label')).toBeVisible()
  })

  it('should show active option', () => {
    const activeOption = TEST_OPTIONS[1]

    renderSelect({ activeKey: activeOption.key })
    expect(screen.queryByText(activeOption.value)).toBeVisible()
  })

  it('should not show active option when showActiveValue=false', () => {
    const activeOption = TEST_OPTIONS[1]

    renderSelect({ activeKey: activeOption.key, showActiveValue: false })
    expect(screen.queryByText(activeOption.value)).not.toBeInTheDocument()
  })

  it('should render tooltip', () => {
    renderSelect({ tooltip: 'test tooltip' })

    const tooltipNode = screen.queryByRole('tooltip')
    expect(tooltipNode).toBeVisible()
  })

  it('should show all options when clicked on', async () => {
    renderSelect()

    await userEvent.click(screen.getByRole('button'))

    TEST_OPTIONS.forEach((option) => {
      expect(screen.queryByText(option.label ?? option.key)).toBeVisible()
      expect(screen.queryByText(option.value)).toBeVisible()
    })
  })

  it('should not show option details', async () => {
    renderSelect({ showDetails: false })

    await userEvent.click(screen.getByRole('button'))

    TEST_OPTIONS.forEach((option) => {
      expect(screen.queryByText(option.label ?? option.key)).toBeVisible()
      expect(screen.queryByText(option.value)).not.toBeInTheDocument()
    })
  })

  it('should close on click away', async () => {
    renderSelect()

    await userEvent.click(screen.getByRole('button'))

    render(<button type="button">clickaway</button>)
    await userEvent.click(screen.getByRole('button', { name: 'clickaway' }))

    TEST_OPTIONS.forEach((option) => {
      expect(
        screen.queryByText(option.label ?? option.key),
      ).not.toBeInTheDocument()

      expect(screen.queryByText(option.value)).not.toBeInTheDocument()
    })
  })

  it('should set active value on click', async () => {
    const activeOption = TEST_OPTIONS[1]
    let selectedKey: string | null = null

    const onChange = jest.fn((key: string | null) => {
      selectedKey = key
    })

    const { container, rerender } = render(
      <Select
        activeKey={selectedKey}
        label="Test Label"
        onChange={onChange}
        options={TEST_OPTIONS}
      />,
    )

    expect(screen.queryByText(activeOption.value)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(
      screen.getByText(`${activeOption.label ?? activeOption.key}`),
    )

    // Verify onChange was called with the correct key
    expect(onChange).toHaveBeenCalledWith(activeOption.key)

    // Re-render with the new selected state
    rerender(
      <Select
        activeKey={selectedKey}
        label="Test Label"
        onChange={onChange}
        options={TEST_OPTIONS}
      />,
    )

    // Close the dropdown by clicking outside since disableCloseOnSelect is true
    await userEvent.click(container)

    // Wait for the dropdown to close and verify the option is selected
    await waitFor(() => {
      expect(screen.getByText(activeOption.value)).toBeVisible()
    })

    // The dropdown should be closed, so the option labels should not be visible
    await waitFor(() => {
      expect(
        screen.queryByText(activeOption.label ?? activeOption.key),
      ).not.toBeInTheDocument()
    })
  })
})
