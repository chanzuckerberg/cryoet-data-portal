import { render, screen } from '@testing-library/react'
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
    renderAccordion()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.queryByText(CHILDREN_TEXT)).toBeVisible()
  })

  it('should close on click', async () => {
    renderAccordion()
    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('button'))
    expect(screen.queryByText(CHILDREN_TEXT)).not.toBeVisible()
  })

  it('should render opened if initialOpen === true', () => {
    renderAccordion(true)
    expect(screen.queryByText(CHILDREN_TEXT)).toBeVisible()
  })
})
