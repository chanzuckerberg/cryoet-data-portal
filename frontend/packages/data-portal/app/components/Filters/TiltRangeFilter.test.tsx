import { render, screen } from '@testing-library/react'
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
    await renderTiltRangeFilter()
    await userEvent.click(screen.getByRole('button'))

    const minInput = screen.getByLabelText('tilt-min-input')
    const maxInput = screen.getByLabelText('tilt-max-input')

    await userEvent.clear(minInput)
    await userEvent.type(minInput, '10')
    await userEvent.clear(maxInput)
    await userEvent.type(maxInput, '5')

    expect(screen.getByRole('button', { name: 'apply' })).toBeDisabled()
  })

  it('should use initial values', async () => {
    remixMock.mockSearchParams(
      new URLSearchParams([
        [QueryParams.TiltRangeMin, '5'],
        [QueryParams.TiltRangeMax, '10'],
      ]),
    )
    await renderTiltRangeFilter()
    await userEvent.click(screen.getByRole('button', { name: 'tiltRange' }))

    expect(screen.getByLabelText('tilt-min-input')).toHaveValue(5)
    expect(screen.getByLabelText('tilt-max-input')).toHaveValue(10)
  })

  it('should apply on click', async () => {
    await renderTiltRangeFilter()
    await userEvent.click(screen.getByRole('button'))

    const minInput = screen.getByLabelText('tilt-min-input')
    const maxInput = screen.getByLabelText('tilt-max-input')

    await userEvent.clear(minInput)
    await userEvent.type(minInput, '5')
    await userEvent.clear(maxInput)
    await userEvent.type(maxInput, '10')
    await userEvent.click(screen.getByRole('button', { name: 'apply' }))

    expect(remixMock.getLastSetParams()?.toString()).toBe(
      `${QueryParams.TiltRangeMin}=5&${QueryParams.TiltRangeMax}=10`,
    )
  })

  it('should reset on click', async () => {
    await renderTiltRangeFilter()
    await userEvent.click(screen.getByRole('button'))

    const minInput = screen.getByLabelText('tilt-min-input')
    const maxInput = screen.getByLabelText('tilt-max-input')

    await userEvent.clear(minInput)
    await userEvent.type(minInput, '5')
    await userEvent.clear(maxInput)
    await userEvent.type(maxInput, '10')
    await userEvent.click(screen.getByRole('button', { name: 'cancel' }))

    expect(remixMock.setParams).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByLabelText('tilt-min-input')).toHaveValue(null)
    expect(screen.getByLabelText('tilt-max-input')).toHaveValue(null)
  })

  it('should remove filter', async () => {
    remixMock.mockSearchParams(
      new URLSearchParams([
        [QueryParams.TiltRangeMin, '5'],
        [QueryParams.TiltRangeMax, '10'],
      ]),
    )
    await renderTiltRangeFilter()

    await userEvent.click(screen.getByRole('button', { name: 'remove-filter' }))
    expect(remixMock.getLastSetParams()?.toString()).toBe('')
  })
})
