import { jest } from '@jest/globals'
import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockOnRemoveFilter = jest.fn()

async function renderDepositionFilterBanner() {
  const { DepositionFilterBanner } = await import('./DepositionFilterBanner')

  function DepositionFilterBannerWrapper() {
    return (
      <DepositionFilterBanner
        label={<span>Test Label</span>}
        onRemoveFilter={mockOnRemoveFilter}
      />
    )
  }

  const DepositionFilterBannerStub = createRemixStub([
    {
      path: '/',
      Component: DepositionFilterBannerWrapper,
    },
  ])

  render(<DepositionFilterBannerStub />)
}

describe('<DepositionFilterBanner />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render label', async () => {
    await renderDepositionFilterBanner()

    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('should call onRemoveFilter on click', async () => {
    await renderDepositionFilterBanner()

    await userEvent.click(screen.getByRole('button', { name: 'removeFilter' }))

    expect(mockOnRemoveFilter).toHaveBeenCalledTimes(1)
  })
})
