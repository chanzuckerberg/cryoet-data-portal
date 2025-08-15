import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Accordion } from './Accordion'

const CHILDREN_TEXT = 'Children'

function renderAccordion(initialOpen = false) {
  render(
    <Accordion id="test" header={<p>Header</p>} initialOpen={initialOpen}>
      {CHILDREN_TEXT}
    </Accordion>,
  )
}

describe('<Accordion />', () => {
  it('should render closed', () => {
    renderAccordion()
    expect(screen.queryByText(CHILDREN_TEXT)).not.toBeVisible()
  })

  it('should open on click', async () => {
    const user = userEvent.setup()
    renderAccordion()

    await user.click(screen.getByRole('button'))

    // Wait for the accordion animation to complete and content to be visible
    await waitFor(() => {
      expect(screen.queryByText(CHILDREN_TEXT)).toBeVisible()
    })
  })

  it('should close on click', async () => {
    const user = userEvent.setup()
    renderAccordion()

    // First click to open
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.queryByText(CHILDREN_TEXT)).toBeVisible()
    })

    // Second click to close
    await user.click(screen.getByRole('button'))

    // Wait for the accordion animation to complete and content to be hidden
    await waitFor(() => {
      expect(screen.queryByText(CHILDREN_TEXT)).not.toBeVisible()
    })
  })

  it('should render opened if initialOpen === true', () => {
    renderAccordion(true)
    expect(screen.queryByText(CHILDREN_TEXT)).toBeVisible()
  })
})
