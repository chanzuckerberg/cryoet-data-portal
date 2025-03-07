import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DropdownFilterButtonProps } from './DropdownFilterButton'

async function renderDropdownFilterButton({
  activeFilters = [],
  children = null,
  disabled,
  label = '',
  onApply = jest.fn(),
  onCancel = jest.fn(),
  onOpen = jest.fn(),
  onRemoveFilter = jest.fn(),
}: Partial<DropdownFilterButtonProps> = {}) {
  const { DropdownFilterButton } = await import('./DropdownFilterButton')

  render(
    <DropdownFilterButton
      activeFilters={activeFilters}
      disabled={disabled}
      label={label}
      onApply={onApply}
      onCancel={onCancel}
      onOpen={onOpen}
      onRemoveFilter={onRemoveFilter}
    >
      {children}
    </DropdownFilterButton>,
  )
}

describe('<DropdownFilterButton />', () => {
  it('should render label', async () => {
    const label = 'Test Label'
    await renderDropdownFilterButton({ label })

    expect(screen.getByText(label)).toBeVisible()
  })

  it('should render active filter chips', async () => {
    const filterWithoutLabel = { value: 'test1' }
    const filterWithLabel = { label: 'Test Filter', value: 'test2' }
    const activeFilters = [filterWithoutLabel, filterWithLabel]

    await renderDropdownFilterButton({ activeFilters })

    expect(screen.getByText(filterWithoutLabel.value)).toBeVisible()
    expect(screen.getByText(filterWithLabel.label)).toBeVisible()
    expect(screen.getByText(filterWithLabel.value)).toBeVisible()
  })

  it('should remove active filter on click', async () => {
    const filter = { label: 'Test Filter', value: 'test' }
    const onRemoveFilter = jest.fn()
    await renderDropdownFilterButton({
      onRemoveFilter,
      activeFilters: [filter],
    })

    await userEvent.click(screen.getByRole('button', { name: 'remove-filter' }))
    expect(onRemoveFilter).toHaveBeenCalledWith(filter)
  })

  it('should open popup on click', async () => {
    const label = 'Test Label'
    const children = 'Test Children'
    const onOpen = jest.fn()
    await renderDropdownFilterButton({ children, label, onOpen })
    expect(screen.queryByText(children)).not.toBeInTheDocument()
    expect(onOpen).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: label }))
    expect(screen.getByText(children)).toBeVisible()
    expect(onOpen).toHaveBeenCalled()
  })

  it('should apply filters on click', async () => {
    const onApply = jest.fn()
    const label = 'Test Label'
    const children = 'Test children'
    await renderDropdownFilterButton({ children, label, onApply })

    await userEvent.click(screen.getByRole('button', { name: label }))
    await userEvent.click(screen.getByRole('button', { name: 'apply' }))
    expect(onApply).toHaveBeenCalled()
    expect(screen.queryByText(children)).not.toBeVisible()
  })

  it('should cancel on click', async () => {
    const onCancel = jest.fn()
    const label = 'Test Label'
    const children = 'Test Children'
    await renderDropdownFilterButton({ children, onCancel, label })

    await userEvent.click(screen.getByRole('button', { name: label }))
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))
    expect(onCancel).toHaveBeenCalled()
    expect(screen.queryByText(children)).not.toBeVisible()
  })

  it('should disable apply button', async () => {
    const onApply = jest.fn()
    const label = 'Test Label'
    await renderDropdownFilterButton({ label, onApply, disabled: true })

    await userEvent.click(screen.getByRole('button', { name: label }))
    expect(screen.getByRole('button', { name: 'apply' })).toBeDisabled()
  })
})
