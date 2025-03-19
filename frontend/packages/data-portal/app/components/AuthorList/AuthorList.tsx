import { ComponentProps, ComponentType, useMemo } from 'react'

import { AuthorLink } from 'app/components/AuthorLink'
import { TestIds } from 'app/constants/testIds'
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
  vertical = false,
}: {
  AuthorLinkComponent?: ComponentType<ComponentProps<typeof AuthorLink>>
  authors: Author[]
  className?: string
  compact?: boolean
  large?: boolean
  subtle?: boolean
  vertical?: boolean
}) {
  const authorsPrimary = [] as Author[]
  const authorsOther = [] as Author[]
  const authorsCorresponding = [] as Author[]
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
    <div data-testid={TestIds.AuthorList} className={className}>
      <ul className={cns(!vertical && 'flex flex-wrap')}>
        {authorsPrimary.map((author, i, arr) => (
          <li
            key={getAuthorKey(author)}
            className={cns(!compact && 'font-semibold', 'pr-sds-xxs')}
          >
            {compact ? (
              author.name
            ) : (
              <AuthorLinkComponent author={author} large={large} />
            )}
            {!(
              authorsOther.length + authorsCorresponding.length === 0 &&
              arr.length - 1 === i
            ) &&
              !vertical &&
              SEPARATOR}
          </li>
        ))}

        {compact ? (
          <li
            className={cns(
              subtle && !compact && 'text-light-sds-color-primitive-gray-600',
              'pr-sds-xxs',
            )}
          >
            {otherCollapsed}
          </li>
        ) : (
          authorsOther.map((author, i, arr) => (
            <li
              key={getAuthorKey(author)}
              className={cns(
                subtle && !compact && 'text-light-sds-color-primitive-gray-600',
                'pr-sds-xxs',
              )}
            >
              <AuthorLinkComponent author={author} large={large} />
              {!(authorsCorresponding.length === 0 && arr.length - 1 === i) &&
                !vertical &&
                SEPARATOR}
            </li>
          ))
        )}

        {authorsCorresponding.map((author, i, arr) => (
          <li key={getAuthorKey(author)} className="pr-sds-xxs">
            {compact ? (
              author.name
            ) : (
              <AuthorLinkComponent author={author} large={large} />
            )}
            {!(arr.length - 1 === i) && !vertical && SEPARATOR}
          </li>
        ))}
      </ul>
    </div>
  )
}
