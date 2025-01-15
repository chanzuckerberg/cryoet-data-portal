import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { InputFilter, InputFilterProps } from './InputFilter'

function renderInputFilter({
  id = 'id',
  label = 'label',
  onChange = jest.fn(),
  value = '',
  hideLabel,
}: Partial<InputFilterProps> = {}) {
  render(
    <InputFilter
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      hideLabel={hideLabel}
    />,
  )
}

describe('<InputFilter />', () => {
  it('should render label', () => {
    const label = 'Test Label'
    renderInputFilter({ label })

    expect(screen.getByText(label)).toBeVisible()
  })

  it('should hide label', () => {
    const label = 'Test Label'
    renderInputFilter({ label, hideLabel: true })

    expect(screen.queryByText(label)).not.toBeInTheDocument()
  })

  it('should update value', async () => {
    const onChange = jest.fn()
    renderInputFilter({ onChange })

    const input = screen.getByRole('textbox')
    const value = 'test'
    await userEvent.type(input, value)

    for (let i = 0; i < value.length; i += 1) {
      expect(onChange.mock.calls[i][0]).toBe(value[i])
    }
  })

  it('should render with initial value', () => {
    const value = 'Test Value'
    renderInputFilter({ value })

    expect(screen.getByRole('textbox')).toHaveValue(value)
  })
})
