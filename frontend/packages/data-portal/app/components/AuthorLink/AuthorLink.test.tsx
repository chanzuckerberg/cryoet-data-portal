import { it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { pick } from 'lodash-es'

import { MockLinkComponent } from 'app/components/Link'

import { AuthorLink } from './AuthorLink'
import { ORC_ID_URL } from './constants'
import { AuthorInfo } from './types'

const DEFAULT_AUTHOR: AuthorInfo = {
  corresponding_author_status: false,
  email: 'actin.filament@gmail.com',
  name: 'Actin Filament',
  orcid: '0000-0000-0000-0000',
  primary_author_status: false,
}

it('should not be link if orc ID is not provided', () => {
  render(<AuthorLink author={pick(DEFAULT_AUTHOR, 'name')} />)
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})

it('should be a link if orc ID is provided', () => {
  render(
    <AuthorLink
      author={pick(DEFAULT_AUTHOR, 'name', 'orcid')}
      LinkComponent={MockLinkComponent}
    />,
  )

  const link = screen.getByRole('link')
  expect(link).toBeInTheDocument()
  expect(link).toHaveProperty('href', `${ORC_ID_URL}/${DEFAULT_AUTHOR.orcid}`)
  expect(screen.getByRole('img', { name: 'orc-id' })).toBeInTheDocument()
})

it('should have mailto link if email is provided', () => {
  render(
    <AuthorLink
      author={pick(DEFAULT_AUTHOR, 'name', 'email')}
      LinkComponent={MockLinkComponent}
    />,
  )

  const link = screen.getByRole('link')
  expect(link).toBeInTheDocument()
  expect(link).toHaveProperty('href', `mailto:${DEFAULT_AUTHOR.email}`)
})

it('should use regular icon size', () => {
  render(<AuthorLink author={pick(DEFAULT_AUTHOR, 'name')} />)

  const text = screen.getByText(DEFAULT_AUTHOR.name)
  expect(text).toHaveClass('text-xs')
})

it('should use large icon size', () => {
  render(<AuthorLink author={pick(DEFAULT_AUTHOR, 'name')} large />)

  const text = screen.getByText(DEFAULT_AUTHOR.name)
  expect(text).toHaveClass('text-sm')
})
