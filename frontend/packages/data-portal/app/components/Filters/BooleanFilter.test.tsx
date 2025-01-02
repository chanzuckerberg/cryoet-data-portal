import { jest } from '@jest/globals'
// eslint-disable-next-line testing-library/no-manual-cleanup
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { BooleanFilter } from './BooleanFilter'

describe('<BooleanFilter />', () => {
  it('should render label', () => {
    const label = 'test'
    render(<BooleanFilter label={label} onChange={() => {}} value={false} />)

    expect(screen.getByText(label)).toBeVisible()
  })

  it('should render caption', () => {
    const caption = 'test'

    render(<BooleanFilter label="label" onChange={() => {}} value={false} />)
    expect(screen.queryByText(caption)).not.toBeInTheDocument()
    cleanup()

    render(
      <BooleanFilter
        label="label"
        caption={caption}
        onChange={() => {}}
        value={false}
      />,
    )
    expect(screen.getByText(caption)).toBeVisible()
  })

  it('should render initial value', () => {
    render(<BooleanFilter label="label" onChange={() => {}} value />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('should update value', async () => {
    const onChange = jest.fn()

    for (const value of [true, false]) {
      render(<BooleanFilter label="label" onChange={onChange} value={value} />)
      expect(onChange).not.toHaveBeenCalled()

      // eslint-disable-next-line no-await-in-loop
      await userEvent.click(screen.getByRole('checkbox'))
      expect(onChange).toHaveBeenCalledWith(!value)
      cleanup()
      onChange.mockClear()
    }
  })
})
