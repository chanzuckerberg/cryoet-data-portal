import { render, screen } from '@testing-library/react'

import { AuthorInfo, MockAuthorLink } from 'app/components/AuthorLink'

import { AuthorList } from './AuthorList'

const DEFAULT_AUTHORS: AuthorInfo[] = [
  { name: 'Foo', corresponding_author_status: true },
  { name: 'Bar' },
  { name: 'Foo Bar', primary_author_status: true },
  { name: 'Foobar Foo' },
  { name: 'Foo Bar 2', primary_author_status: true },
  { name: 'Foo 2', corresponding_author_status: true },
  { name: 'Bar 2' },
]

const AUTHOR_MAP = Object.fromEntries(
  DEFAULT_AUTHORS.map((author) => [author.name, author]),
)

it('should render authors', () => {
  render(<AuthorList authors={DEFAULT_AUTHORS} />)

  DEFAULT_AUTHORS.forEach((author) =>
    expect(screen.getByText(author.name)).toBeInTheDocument(),
  )
})

it('should sort primary authors', () => {
  render(<AuthorList authors={DEFAULT_AUTHORS} />)
  const authorNode = screen.getByRole('paragraph')
  const authors = (authorNode.textContent ?? '').split(', ')

  expect(AUTHOR_MAP[authors[0]].primary_author_status).toBe(true)
  expect(AUTHOR_MAP[authors[1]].primary_author_status).toBe(true)
})

it('should sort other authors', () => {
  render(<AuthorList authors={DEFAULT_AUTHORS} />)
  const authorNode = screen.getByRole('paragraph')
  const authors = (authorNode.textContent ?? '').split(', ')
  const otherAuthors = authors.slice(2, -2)

  otherAuthors.forEach((author) => {
    expect(AUTHOR_MAP[author].primary_author_status).toBeUndefined()
    expect(AUTHOR_MAP[author].corresponding_author_status).toBeUndefined()
  })
})

it('should sort corresponding authors', () => {
  render(<AuthorList authors={DEFAULT_AUTHORS} />)
  const authorNode = screen.getByRole('paragraph')
  const authors = (authorNode.textContent ?? '').split(', ')

  expect(AUTHOR_MAP[authors.at(-1) ?? ''].corresponding_author_status).toBe(
    true,
  )
  expect(AUTHOR_MAP[authors.at(-2) ?? ''].corresponding_author_status).toBe(
    true,
  )
})

it('should render author links', () => {
  const authors = DEFAULT_AUTHORS.map((author, idx) => ({
    ...author,
    orcid: `0000-0000-0000-000${idx}`,
  }))

  render(<AuthorList authors={authors} AuthorLinkComponent={MockAuthorLink} />)

  authors.forEach((author) =>
    expect(
      screen.getByRole('link', { name: `${author.name}` }),
    ).toBeInTheDocument(),
  )
})

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
  expect(screen.getByText((text) => text.includes('... ,'))).toBeInTheDocument()
})

it('should not render comma for others if compact and no corresponding authors', () => {
  render(
    <AuthorList
      authors={DEFAULT_AUTHORS.filter(
        (author) => !author.corresponding_author_status,
      )}
      compact
    />,
  )

  expect(screen.getByText((text) => text.includes('...'))).toBeInTheDocument()
  expect(
    screen.queryByText((text) => text.includes('... ,')),
  ).not.toBeInTheDocument()
})
