import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'

import { DOI_URL, EMDB_URL, EMPIAR_URL } from 'app/constants/external-dbs'

import { DatabaseEntry, DatabaseEntryProps } from './DatabaseEntry'

const TEST_DOI = '10.1234/2022.04.20.488077'

const TEST_CASES = [
  {
    entry: 'EMPIAR-123',
    label: 'EMPIAR ID',
    id: '123',
    url: `${EMPIAR_URL}123`,
  },
  {
    entry: 'EMD-123',
    label: 'EMDB ID',
    id: '123',
    url: `${EMDB_URL}123`,
  },
  {
    entry: TEST_DOI,
    label: 'DOI',
    id: TEST_DOI,
    url: `${DOI_URL}${TEST_DOI}`,
  },
]

function renderDatabaseEntry({ entry, inline }: DatabaseEntryProps) {
  function DatabaseEntryWrapper() {
    return <DatabaseEntry entry={entry} inline={inline} />
  }

  const DatasetEntryStub = createRemixStub([
    {
      path: '/',
      Component: DatabaseEntryWrapper,
    },
  ])

  render(<DatasetEntryStub />)
}

describe('<DatabaseEntry />', () => {
  it('should render entry as is if no database type is found', () => {
    renderDatabaseEntry({ entry: 'test' })

    expect(screen.queryByText('test')).toBeVisible()
  })

  TEST_CASES.forEach(({ entry, label, id, url }) => {
    const isDOI = entry === TEST_DOI

    it(`should render database type for ${label}`, () => {
      renderDatabaseEntry({ entry })

      expect(screen.queryByText(`${label}:`)).toBeVisible()

      const link = screen.queryByRole('link')
      expect(link).toBeVisible()
      expect(link).toHaveTextContent(isDOI ? entry : id)
      expect(link).toHaveAttribute('href', url)
    })

    it(`should ${isDOI ? 'show' : 'hide'} label for inline ${label}`, () => {
      renderDatabaseEntry({ inline: true, entry })

      // eslint-disable-next-line jest/valid-expect
      const matcher = expect(screen.queryByText(`${label}:`))

      if (isDOI) {
        matcher.toBeVisible()
      } else {
        matcher.not.toBeInTheDocument()
      }
    })
  })
})
