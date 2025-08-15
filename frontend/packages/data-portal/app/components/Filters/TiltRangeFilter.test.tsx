import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { QueryParams } from 'app/constants/query'
import { RemixMock } from 'app/mocks/Remix.mock'

const remixMock = new RemixMock()

async function renderTiltRangeFilter() {
  const { TiltRangeFilter } = await import('./TiltRangeFilter')
  render(<TiltRangeFilter />)
}

describe('<TiltRangeFilter />', () => {
  beforeEach(() => {
    remixMock.reset()
  })

  it('should disable for invalid input', async () => {
    const user = userEvent.setup()
    await renderTiltRangeFilter()

    // Click to open the dropdown and wait for inputs to be visible
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByLabelText('tilt-min-input')).toBeVisible()
    })

    const minInput = screen.getByLabelText('tilt-min-input')
    const maxInput = screen.getByLabelText('tilt-max-input')

    await user.clear(minInput)
    await user.type(minInput, '10')
    await user.clear(maxInput)
    await user.type(maxInput, '5')

    // Wait for validation to update button state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'apply' })).toBeDisabled()
    })
  })

  it('should use initial values', async () => {
    const user = userEvent.setup()
    remixMock.mockSearchParams(
      new URLSearchParams([
        [QueryParams.TiltRangeMin, '5'],
        [QueryParams.TiltRangeMax, '10'],
      ]),
    )
    await renderTiltRangeFilter()

    // Click to open the dropdown and wait for inputs to be visible
    await user.click(screen.getByRole('button', { name: 'tiltRange' }))
    await waitFor(() => {
      expect(screen.getByLabelText('tilt-min-input')).toBeVisible()
    })

    await waitFor(() => {
      expect(screen.getByLabelText('tilt-min-input')).toHaveValue(5)
    })
    await waitFor(() => {
      expect(screen.getByLabelText('tilt-max-input')).toHaveValue(10)
    })
  })

  it('should apply on click', async () => {
    const user = userEvent.setup()
    await renderTiltRangeFilter()

    // Click to open the dropdown and wait for inputs to be visible
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByLabelText('tilt-min-input')).toBeVisible()
    })

    const minInput = screen.getByLabelText('tilt-min-input')
    const maxInput = screen.getByLabelText('tilt-max-input')

    await user.clear(minInput)
    await user.type(minInput, '5')
    await user.clear(maxInput)
    await user.type(maxInput, '10')

    // Wait for apply button to be enabled and click
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'apply' })).toBeEnabled()
    })
    await user.click(screen.getByRole('button', { name: 'apply' }))

    expect(remixMock.getLastSetParams()?.toString()).toBe(
      `${QueryParams.TiltRangeMin}=5&${QueryParams.TiltRangeMax}=10`,
    )
  })

  it('should reset on click', async () => {
    const user = userEvent.setup()
    await renderTiltRangeFilter()

    // Click to open the dropdown and wait for inputs to be visible
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByLabelText('tilt-min-input')).toBeVisible()
    })

    const minInput = screen.getByLabelText('tilt-min-input')
    const maxInput = screen.getByLabelText('tilt-max-input')

    await user.clear(minInput)
    await user.type(minInput, '5')
    await user.clear(maxInput)
    await user.type(maxInput, '10')
    await user.click(screen.getByRole('button', { name: 'cancel' }))

    expect(remixMock.setParams).not.toHaveBeenCalled()

    // Click to open dropdown again and verify reset
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByLabelText('tilt-min-input')).toBeVisible()
    })

    expect(screen.getByLabelText('tilt-min-input')).toHaveValue(null)
    expect(screen.getByLabelText('tilt-max-input')).toHaveValue(null)
  })

  it('should remove filter', async () => {
    const user = userEvent.setup()
    remixMock.mockSearchParams(
      new URLSearchParams([
        [QueryParams.TiltRangeMin, '5'],
        [QueryParams.TiltRangeMax, '10'],
      ]),
    )
    await renderTiltRangeFilter()

    // Wait for remove filter button to be visible and click
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'remove-filter' }),
      ).toBeVisible()
    })
    await user.click(screen.getByRole('button', { name: 'remove-filter' }))

    expect(remixMock.getLastSetParams()?.toString()).toBe('')
  })
})
