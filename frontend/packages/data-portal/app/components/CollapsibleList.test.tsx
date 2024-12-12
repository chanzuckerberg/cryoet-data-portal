/* eslint-disable jest/no-conditional-expect */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { CollapsibleList, CollapsibleListEntry } from './CollapsibleList'

const ENTRIES: CollapsibleListEntry[] = [
  {
    key: '1',
    entry: 'Foo',
  },
  {
    key: '2',
    entry: 'Bar',
  },
  {
    key: '3',
    entry: 'FooBar',
  },
  {
    key: '4',
    entry: 'BarFoo',
  },
]

describe('<CollapsibleList />', () => {
  it('should render empty state', () => {
    render(<CollapsibleList />)

    expect(screen.queryByText('notSubmitted')).toBeVisible()
  })

  it('should render all items', () => {
    render(<CollapsibleList entries={ENTRIES} />)

    ENTRIES.forEach(({ entry }) =>
      expect(screen.queryByText(String(entry))).toBeVisible(),
    )
  })

  it('should render all items if entries is greater than collapseAfter by 1', () => {
    render(
      <CollapsibleList entries={ENTRIES} collapseAfter={ENTRIES.length + 1} />,
    )

    ENTRIES.forEach(({ entry }) =>
      expect(screen.queryByText(String(entry))).toBeVisible(),
    )
  })

  it('should render all items if entries.length < collapseAfter', () => {
    render(
      <CollapsibleList entries={ENTRIES} collapseAfter={ENTRIES.length + 5} />,
    )

    ENTRIES.forEach(({ entry }) =>
      expect(screen.queryByText(String(entry))).toBeVisible(),
    )
  })

  it('should render up to collapseAfter items', () => {
    const collapseAfter = 2
    render(<CollapsibleList entries={ENTRIES} collapseAfter={collapseAfter} />)

    ENTRIES.slice(0, collapseAfter).forEach(({ entry }, idx) => {
      const entryNode = screen.queryByText(String(entry))

      if (idx < collapseAfter) {
        expect(entryNode).toBeVisible()
      } else {
        expect(entryNode).not.toBeInTheDocument()
      }
    })
  })

  it('should render remaining items in collapsible', async () => {
    const collapseAfter = 2
    render(<CollapsibleList entries={ENTRIES} collapseAfter={collapseAfter} />)

    await userEvent.click(screen.getByRole('button'))

    ENTRIES.slice(collapseAfter).forEach(({ entry }) => {
      expect(screen.queryByText(String(entry))).toBeVisible()
    })

    expect(screen.queryByRole('button', { name: 'showLess' })).toBeVisible()
  })
})
