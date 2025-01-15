import { jest } from '@jest/globals'
import { PaperProps } from '@mui/material/Paper'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Drawer } from './Drawer'

const onCloseMock = jest.fn()

function renderDrawer(open = false) {
  render(
    <div>
      <button type="button">some button</button>

      <Drawer
        open={open}
        onClose={onCloseMock}
        PaperComponent={({ children }: PaperProps) => <div>{children}</div>}
      >
        <p>content</p>
      </Drawer>
    </div>,
  )
}

describe('<Drawer />', () => {
  it('should hide drawer contents when closed', () => {
    renderDrawer()

    expect(screen.queryByText('content')).not.toBeInTheDocument()
  })

  it('should show drawer contents when opened', () => {
    renderDrawer(true)

    expect(screen.queryByText('content')).toBeVisible()
  })

  it('should call onClose when clicked outside', async () => {
    renderDrawer(true)

    expect(onCloseMock).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'some button' }))
    expect(onCloseMock).toHaveBeenCalled()
  })
})
