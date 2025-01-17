import { jest } from '@jest/globals'
import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockReset = jest.fn()

jest.unstable_mockModule('app/hooks/useFilter', () => ({
  __esModule: true,
  useFilter: () => ({
    reset: mockReset,
  }),
}))

async function renderNoFilteredResults(showSearchTip = false) {
  const { NoFilteredResults } = await import('./NoFilteredResults')

  function NoFilteredResultsWrapper() {
    return <NoFilteredResults showSearchTip={showSearchTip} />
  }

  const NoFilteredResultsStub = createRemixStub([
    {
      path: '/',
      Component: NoFilteredResultsWrapper,
    },
  ])

  render(<NoFilteredResultsStub />)
}

describe('<NoFilteredResults />', () => {
  it('should not show search tip if false', async () => {
    await renderNoFilteredResults()

    expect(screen.queryByText('noResultsSearch')).not.toBeInTheDocument()
  })

  it('should show search tip if true', async () => {
    await renderNoFilteredResults(true)

    expect(screen.queryByText('noResultsSearch')).toBeVisible()
  })

  it('should reset state on click', async () => {
    await renderNoFilteredResults()

    expect(mockReset).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button'))
    expect(mockReset).toHaveBeenCalled()
  })
})
