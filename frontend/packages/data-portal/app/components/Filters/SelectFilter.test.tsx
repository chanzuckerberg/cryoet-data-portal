import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BaseFilterOption } from 'app/types/filter'

import { SelectFilter, SelectFilterProps } from './SelectFilter'

function renderSelectFilter<
  Option extends BaseFilterOption,
  Multiple extends boolean = false,
>({
  details,
  label = '',
  multiple,
  onChange = jest.fn(),
  options = [],
  search,
  title,
  value,
}: Partial<SelectFilterProps<Option, Multiple>> = {}) {
  render(
    <SelectFilter
      details={details}
      label={label}
      multiple={multiple}
      onChange={onChange}
      options={options}
      search={search}
      title={title}
      value={value}
    />,
  )
}

describe('<SelectFilter />', () => {
  it('should render label', () => {
    const label = 'Test Label'
    renderSelectFilter({ label })

    expect(screen.getByText(label)).toBeVisible()
  })

  it('should render title', async () => {
    const title = 'Test Title'
    const options = [{ value: 'Option 1' }, { value: 'Option 2' }]
    renderSelectFilter({ title, options })
    // Wait for the button to appear and then click it
    const button = await screen.findByRole('button')
    await userEvent.click(button)

    expect(screen.getByText(title)).toBeVisible()
  })

  it('should render details', () => {
    const details = 'Test Details'
    renderSelectFilter({ details })

    expect(screen.getByText(details)).toBeVisible()
  })

  it('should render with initial value', () => {
    const value = 'Test Value'
    renderSelectFilter({
      value: { value },
    })

    expect(screen.getByText(value)).toBeVisible()
  })

  it('should render options', async () => {
    const options = [
      { value: 'Option 1' },
      { value: 'Option 2' },
      { value: 'Option 3' },
    ]
    renderSelectFilter({ options })

    // Wait for the button to appear and then click it
    const button = await screen.findByRole('button')
    await userEvent.click(button)

    options.forEach(({ value }) => {
      expect(screen.getByText(value)).toBeVisible()
    })
  })

  it('should update value', async () => {
    const options = [
      { value: 'Option 1' },
      { value: 'Option 2' },
      { value: 'Option 3' },
    ]
    const { value } = options[1]
    renderSelectFilter({ options })

    // Wait for the button to appear and then click it
    const button = await screen.findByRole('button')
    await userEvent.click(button)
    await userEvent.click(screen.getByText(value))

    expect(screen.getByText(value)).toBeVisible()
  })

  it('should select multiple values', async () => {
    const options = [
      { value: 'Option 1' },
      { value: 'Option 2' },
      { value: 'Option 3' },
    ]
    const value1 = options[0].value
    const value2 = options[1].value
    renderSelectFilter({ options, multiple: true })

    // Wait for the button to appear and then click it
    const button = await screen.findByRole('button')
    await userEvent.click(button)
    await userEvent.click(screen.getByText(value1))
    await userEvent.click(screen.getByText(value2))
    await userEvent.keyboard('{Escape}')

    expect(screen.getByText(value1)).toBeVisible()
    expect(screen.getByText(value2)).toBeVisible()
  })

  it('should search values', async () => {
    const options = [
      { value: 'Option 1' },
      { value: 'Option 2' },
      { value: 'Option 3' },
    ]
    renderSelectFilter({ options, search: true })

    // Wait for the button to appear and then click it
    const button = await screen.findByRole('button')
    await userEvent.click(button)
    // Wait for the combobox to appear after clicking the button
    const combobox = await screen.findByRole('combobox')
    await userEvent.type(combobox, '1')

    expect(screen.getByText(options[0].value)).toBeVisible()
    expect(screen.queryByText(options[1].value)).not.toBeInTheDocument()
    expect(screen.queryByText(options[2].value)).not.toBeInTheDocument()
  })
})
