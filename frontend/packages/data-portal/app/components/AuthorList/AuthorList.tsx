import { ComponentProps, ComponentType, Fragment } from 'react'

import { AuthorInfo, AuthorLink } from 'app/components/AuthorLink'
import { cns } from 'app/utils/cns'

function getAuthorKey(author: AuthorInfo) {
  return author.name + author.email + author.orcid
}

const COMMA_SPACE = `, `
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
  const primary = []
  const other = []
  const corresponding = []
  for (const author of authors) {
    if (author.primary_author_status) {
      primary.push(author)
    } else if (author.corresponding_author_status) {
      corresponding.push(author)
    } else {
      other.push(author)
    }
  }
  const hasOther = other.length > 0
  const hasCorresponding = corresponding.length > 0

  return (
    <p className={className}>
      {/* Primary authors: */}
      <span className={cns(!compact && 'font-semibold')}>
        {primary.map((author, i) => (
          <Fragment key={getAuthorKey(author)}>
            {compact ? (
              author.name
            ) : (
              <AuthorLinkComponent author={author} large={large} />
            )}
            {i < primary.length - 1 && COMMA_SPACE}
          </Fragment>
        ))}
        {(hasOther || hasCorresponding) && COMMA_SPACE}
        {(hasOther || hasCorresponding) && compact && ELLIPSIS}
      </span>

      {!compact && (
        <span className={cns(subtle && 'text-sds-gray-600')}>
          {/* Other authors: */}
          {other.map((author, i) => (
            <Fragment key={getAuthorKey(author)}>
              <AuthorLinkComponent author={author} large={large} />
              {i < other.length - 1 && COMMA_SPACE}
            </Fragment>
          ))}
          {hasCorresponding && COMMA_SPACE}

          {/* Corresponding authors: */}
          {corresponding.map((author, i) => (
            <Fragment key={getAuthorKey(author)}>
              <AuthorLinkComponent author={author} large={large} />
              {i < corresponding.length - 1 && COMMA_SPACE}
            </Fragment>
          ))}
        </span>
      )}
    </p>
  )
}
