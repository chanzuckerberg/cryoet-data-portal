import { ComponentProps } from 'react'

import { MockLinkComponent } from 'app/components/Link'

import { AuthorLink } from './AuthorLink'

export function MockAuthorLink({
  author,
  large,
}: ComponentProps<typeof AuthorLink>) {
  return (
    <AuthorLink
      author={author}
      large={large}
      LinkComponent={MockLinkComponent}
    />
  )
}
