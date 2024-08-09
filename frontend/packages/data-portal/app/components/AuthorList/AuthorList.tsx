import { ComponentProps, ComponentType, Fragment } from 'react'

import { AuthorInfo, AuthorLink } from 'app/components/AuthorLink'
import { cns } from 'app/utils/cns'

function getAuthorKey(author: AuthorInfo) {
  return author.name + author.email + author.orcid
}

const COMMA = `, `
const ELLIPSIS = '...'

export function AuthorList({
  AuthorLinkComponent = AuthorLink,
  authors,
  className,
  compact = false,
  large,
  subtle = false,
}: {
  AuthorLinkComponent?: ComponentType<ComponentProps<typeof AuthorLink>>
  authors: AuthorInfo[]
  className?: string
  compact?: boolean
  large?: boolean
  subtle?: boolean
}) {
  const authorsPrimary = []
  const authorsCorresponding = []
  const authorsOther = []
  for (const author of authors) {
    if (author.primary_author_status) {
      authorsPrimary.push(author)
    } else if (author.corresponding_author_status) {
      authorsCorresponding.push(author)
    } else {
      authorsOther.push(author)
    }
  }

  return (
    <p className={className}>
      <span className={cns(!compact && 'font-semibold')}>
        {authorsPrimary.map((author, i) => (
          <Fragment key={getAuthorKey(author)}>
            {compact ? (
              author.name
            ) : (
              <AuthorLinkComponent author={author} large={large} />
            )}
            {i < authorsPrimary.length - 1 && COMMA}
          </Fragment>
        ))}
        {(authorsOther.length > 0 || authorsCorresponding.length > 0) && COMMA}{' '}
        {compact &&
          (authorsOther.length > 0 || authorsCorresponding.length > 0) &&
          ELLIPSIS}
      </span>

      {!compact && (
        <span className={cns(subtle && 'text-sds-gray-600')}>
          {authorsOther.map((author, i, arr) => (
            <Fragment key={getAuthorKey(author)}>
              <AuthorLinkComponent author={author} large={large} />
              {!(authorsCorresponding.length === 0 && arr.length - 1 === i) &&
                COMMA}
            </Fragment>
          ))}

          {authorsCorresponding.map((author, i, arr) => (
            <Fragment key={getAuthorKey(author)}>
              <AuthorLinkComponent author={author} large={large} />
              {!(arr.length - 1 === i) && COMMA}
            </Fragment>
          ))}
        </span>
      )}
    </p>
  )
}
