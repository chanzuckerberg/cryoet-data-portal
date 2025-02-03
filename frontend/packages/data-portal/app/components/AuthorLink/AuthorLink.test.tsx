import { it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { pick } from 'lodash-es'

import { MockLinkComponent } from 'app/components/Link'
import { TestIds } from 'app/constants/testIds'

import { AuthorLink } from './AuthorLink'
import { ORC_ID_URL } from './constants'
import { AuthorInfo } from './types'

const DEFAULT_AUTHOR: AuthorInfo = {
  correspondingAuthorStatus: true,
  email: 'actin.filament@gmail.com',
  name: 'Actin Filament',
  orcid: '0000-0000-0000-0000',
  primaryAuthorStatus: false,
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
  expect(screen.getByTestId(TestIds.OrcIdIcon)).toBeInTheDocument()
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
