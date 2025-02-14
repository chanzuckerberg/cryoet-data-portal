import { it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { pick } from 'lodash-es'

import { MockLinkComponent } from 'app/components/Link'
import { TestIds } from 'app/constants/testIds'

import { Author as AuthorPlusKaggle, AuthorLink } from './AuthorLink'
import { ORC_ID_URL } from './constants'

const DEFAULT_AUTHOR: AuthorPlusKaggle = {
  correspondingAuthorStatus: true,
  email: 'actin.filament@gmail.com',
  name: 'Actin Filament',
  orcid: '0000-0000-0000-0000',
  kaggleId: 'actin_filament',
  primaryAuthorStatus: false,
}

it('should not be link if orc ID or kaggleId is not provided', () => {
  render(<AuthorLink author={pick(DEFAULT_AUTHOR, 'name')} />)
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})

it('should be a link if only orc ID provided', () => {
  render(
    <AuthorLink
      author={pick(DEFAULT_AUTHOR, 'name', 'orcid')}
      LinkComponent={MockLinkComponent}
    />,
  )

  const link = screen.getByRole('link')
  expect(link).toBeInTheDocument()
  expect(link).toHaveProperty('href', `${ORC_ID_URL}/${DEFAULT_AUTHOR.orcid}`)
  expect(screen.getByTestId(TestIds.OrcIdIcon)).toBeInTheDocument()
})

it('should have a tooltip if kaggle Id provided', () => {
  render(
    <AuthorLink
      author={pick(DEFAULT_AUTHOR, 'name', 'kaggleId')}
      LinkComponent={MockLinkComponent}
    />,
  )

  const link = screen.getByTestId(TestIds.AuthorLink)
  expect(link).toBeInTheDocument()
})

it('should have icon if user is corresponding author', () => {
  render(
    <AuthorLink
      author={pick(DEFAULT_AUTHOR, 'name', 'correspondingAuthorStatus')}
      LinkComponent={MockLinkComponent}
    />,
  )

  expect(screen.getByTestId(TestIds.EnvelopeIcon)).toBeInTheDocument()
})

it('should use regular icon size', () => {
  render(<AuthorLink author={pick(DEFAULT_AUTHOR, 'name')} />)

  const text = screen.getByText(DEFAULT_AUTHOR.name!)
  expect(text).toHaveClass('text-xs')
})

it('should use large icon size', () => {
  render(<AuthorLink author={pick(DEFAULT_AUTHOR, 'name')} large />)

  const text = screen.getByText(DEFAULT_AUTHOR.name!)
  expect(text).toHaveClass('text-sm')
})
