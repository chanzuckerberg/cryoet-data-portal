import { render, screen } from '@testing-library/react'

import { MockAuthorLink } from 'app/components/AuthorLink'
import { TestIds } from 'app/constants/testIds'
import { AuthorInfoType } from 'app/types/authorInfo'

import { AuthorList } from './AuthorList'

const DEFAULT_AUTHORS: AuthorInfoType[] = [
  { name: 'Foo', correspondingAuthorStatus: true },
  { name: 'Bar' },
  { name: 'Foo Bar', primaryAuthorStatus: true },
  { name: 'Foobar Foo' },
  { name: 'Foo Bar 2', primaryAuthorStatus: true },
  { name: 'Foo 2', correspondingAuthorStatus: true },
  { name: 'Bar 2' },
]

const AUTHOR_MAP = Object.fromEntries(
  DEFAULT_AUTHORS.map((author) => [author.name, author]),
)

describe('non-compact', () => {
  it('should render authors', () => {
    render(<AuthorList authors={DEFAULT_AUTHORS} />)

    DEFAULT_AUTHORS.forEach((author) =>
      expect(screen.getByText(author.name)).toBeInTheDocument(),
    )
  })

  it('should sort primary authors', () => {
    render(<AuthorList authors={DEFAULT_AUTHORS} />)
    const authors = findAuthorStrings()

    expect(AUTHOR_MAP[authors[0]].primaryAuthorStatus!).toBe(true)
    expect(AUTHOR_MAP[authors[1]].primaryAuthorStatus!).toBe(true)
  })

  it('should sort other authors', () => {
    render(<AuthorList authors={DEFAULT_AUTHORS} />)
    const authors = findAuthorStrings()
    const otherAuthors = authors.slice(2, -2)

    otherAuthors.forEach((author) => {
      expect(AUTHOR_MAP[author].primaryAuthorStatus).toBeUndefined()
      expect(AUTHOR_MAP[author].correspondingAuthorStatus).toBeUndefined()
    })
  })

  it('should sort corresponding authors', () => {
    render(<AuthorList authors={DEFAULT_AUTHORS} />)
    const authors = findAuthorStrings()

    expect(AUTHOR_MAP[authors.at(-1) ?? ''].correspondingAuthorStatus).toBe(
      true,
    )
    expect(AUTHOR_MAP[authors.at(-2) ?? ''].correspondingAuthorStatus).toBe(
      true,
    )
  })

  it('should render author links', () => {
    const authors = DEFAULT_AUTHORS.map((author, idx) => ({
      ...author,
      orcid: `0000-0000-0000-000${idx}`,
    }))

    render(
      <AuthorList authors={authors} AuthorLinkComponent={MockAuthorLink} />,
    )

    authors.forEach((author) =>
      expect(
        screen.getByRole('link', { name: `${author.name}` }),
      ).toBeInTheDocument(),
    )
  })

  it('should not display any author more than once', () => {
    render(
      <AuthorList
        authors={[
          {
            name: 'One',
            primaryAuthorStatus: true,
            correspondingAuthorStatus: true,
          },
          {
            name: 'Two',
          },
        ]}
      />,
    )

    const authors = findAuthorStrings()

    expect(authors.length).toBe(2)
    expect(authors[0]).toBe('One')
    expect(authors[1]).toBe('Two')
  })
})

describe('compact', () => {
  it('should not render author links when compact', () => {
    const authors = DEFAULT_AUTHORS.map((author, idx) => ({
      ...author,
      orcid: `0000-0000-0000-000${idx}`,
    }))

    render(
      <AuthorList
        authors={authors}
        AuthorLinkComponent={MockAuthorLink}
        compact
      />,
    )

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('should not render other authors when compact', () => {
    render(<AuthorList authors={DEFAULT_AUTHORS} compact />)
    const authorNode = screen.getByRole('paragraph')
    const authors = (authorNode.textContent ?? '').split(', ')
    const otherAuthors = authors.slice(2, -2)

    otherAuthors.forEach((author) =>
      expect(screen.queryByText(author)).not.toBeInTheDocument(),
    )
  })

  it('should render comma if compact and has corresponding authors', () => {
    render(<AuthorList authors={DEFAULT_AUTHORS} compact />)
    expect(
      screen.getByText((text) => text.includes('... ,')),
    ).toBeInTheDocument()
  })

  it('should not render comma for others if compact and no corresponding authors', () => {
    render(
      <AuthorList
        authors={DEFAULT_AUTHORS.filter(
          (author) => !author.correspondingAuthorStatus,
        )}
        compact
      />,
    )

    expect(screen.getByText((text) => text.includes('...'))).toBeInTheDocument()
    expect(
      screen.queryByText((text) => text.includes('... ,')),
    ).not.toBeInTheDocument()
  })
})

function findAuthorStrings(): string[] {
  return (screen.getByTestId(TestIds.AuthorList).textContent ?? '').split(', ')
}
