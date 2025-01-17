import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Select, SelectOption, SelectProps } from './Select'

const TEST_OPTIONS: SelectOption[] = Array(3)
  .fill(null)
  .map((_, idx) => ({
    key: `test${idx}`,
    value: `Value ${idx}`,
    label: `Label ${idx}`,
  }))

function renderSelect({
  activeKey = null,
  label = 'Test Label',
  onChange = jest.fn(),
  ...props
}: Partial<SelectProps> = {}) {
  return render(
    <Select
      activeKey={activeKey}
      label={label}
      onChange={onChange}
      options={TEST_OPTIONS}
      {...props}
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
    renderSelect()

    const activeOption = TEST_OPTIONS[1]
    expect(screen.queryByText(activeOption.value)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(
      screen.getByText(`${activeOption.label ?? activeOption.key}`),
    )

    expect(
      screen.queryByText(activeOption.label ?? activeOption.key),
    ).not.toBeInTheDocument()
    expect(screen.queryByText(activeOption.value)).not.toBeInTheDocument()
  })
})
