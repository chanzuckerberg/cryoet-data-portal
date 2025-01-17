import { jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CopyBox } from './CopyBox'

describe('<CopyBox />', () => {
  it('should show title if defined', () => {
    render(<CopyBox content="content" title="title" />)

    expect(screen.queryByText('title:')).toBeVisible()
  })

  it('should copy to clipboard', async () => {
    const onCopy = jest.fn()
    const writeText = jest.fn()

    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    })

    render(<CopyBox content="content" onCopy={onCopy} />)

    expect(writeText).not.toHaveBeenCalled()
    expect(onCopy).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button'))
    expect(writeText).toHaveBeenCalled()
    expect(onCopy).toHaveBeenCalled()
  })
})
