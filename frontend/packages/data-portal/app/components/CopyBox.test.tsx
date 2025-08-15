import { jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CopyBox } from './CopyBox'

describe('<CopyBox />', () => {
  it('should show title if defined', () => {
    render(<CopyBox content="content" title="title" />)

    expect(screen.queryByText('title:')).toBeVisible()
  })

  it('should copy to clipboard', async () => {
    const user = userEvent.setup()
    const onCopy = jest.fn()
    const writeText = jest.fn()

    // Mock navigator.clipboard using Object.defineProperty since it's read-only
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText,
      },
      writable: true,
    })

    render(<CopyBox content="content" onCopy={onCopy} />)

    expect(writeText).not.toHaveBeenCalled()
    expect(onCopy).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button'))

    // Wait for async clipboard operation and callbacks to complete
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('content')
    })
    await waitFor(() => {
      expect(onCopy).toHaveBeenCalled()
    })
  })
})
