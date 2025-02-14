import { ComponentProps, ComponentType, Fragment, useMemo } from 'react'

import { AuthorLink } from 'app/components/AuthorLink'
import { Author } from 'app/types/gql/genericTypes'
import { cns } from 'app/utils/cns'

function getAuthorKey(author: Author): string {
  return `${author.name}-${author.email}`
}

const SEPARATOR = `, `

function getAuthorIds(authors: Author[]) {
  return authors.map(
    (author) => `${author.name} - ${author.email} - ${author.orcid}`,
  )
}

export function AuthorList({
  AuthorLinkComponent = AuthorLink,
  authors,
  className,
  compact = false,
  large,
  subtle = false,
}: {
  AuthorLinkComponent?: ComponentType<ComponentProps<typeof AuthorLink>>
  authors: Author[]
  className?: string
  compact?: boolean
  large?: boolean
  subtle?: boolean
}) {
  const authorsPrimary = []
  const authorsOther = []
  const authorsCorresponding = []
  for (const author of authors) {
    if (author.primaryAuthorStatus) {
      authorsPrimary.push(author)
    } else if (author.correspondingAuthorStatus) {
      authorsCorresponding.push(author)
    } else {
      authorsOther.push(author)
    }
  }

  const otherCollapsed = useMemo<string | null>(() => {
    const ellipsis = '...'

    if (compact && authorsOther.length > 0) {
      if (authorsCorresponding.length === 0) {
        return ellipsis
      }
      return `${ellipsis} ${SEPARATOR}`
    }
    return null
  }, [
    authorsCorresponding.length,
    authorsOther.length,
    compact,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getAuthorIds(authorsCorresponding),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    getAuthorIds(authorsOther),
  ])

  // TODO: let's find a better way of doing this
  return (
    <p className={className}>
      <span className={cns(!compact && 'font-semibold')}>
        {authorsPrimary.map((author, i, arr) => (
          <Fragment key={getAuthorKey(author)}>
            {compact ? (
              author.name
            ) : (
              <AuthorLinkComponent author={author} large={large} />
            )}
            {!(
              authorsOther.length + authorsCorresponding.length === 0 &&
              arr.length - 1 === i
            ) && SEPARATOR}
          </Fragment>
        ))}
      </span>

      <span
        className={cns(
          subtle && !compact && 'text-sds-color-primitive-gray-600',
        )}
      >
        {compact
          ? otherCollapsed
          : authorsOther.map((author, i, arr) => (
              <Fragment key={getAuthorKey(author)}>
                <AuthorLinkComponent author={author} large={large} />
                {!(authorsCorresponding.length === 0 && arr.length - 1 === i) &&
                  SEPARATOR}
              </Fragment>
            ))}

        {authorsCorresponding.map((author, i, arr) => (
          <Fragment key={getAuthorKey(author)}>
            {compact ? (
              author.name
            ) : (
              <AuthorLinkComponent author={author} large={large} />
            )}
            {!(arr.length - 1 === i) && SEPARATOR}
          </Fragment>
        ))}
      </span>
    </p>
  )
}
