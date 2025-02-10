import { ComponentProps, ComponentType, useMemo } from 'react'

import {
  AuthorInfo as AuthorInfoSansKaggle,
  AuthorLink,
  convertToAuthorInfoV2,
} from 'app/components/AuthorLink'
import { cns } from 'app/utils/cns'

// TODO(smccanny): Remove this when we have a proper author info type
type AuthorInfo = AuthorInfoSansKaggle & {
  kaggleId?: string
  kaggleUserName?: string
}

function getAuthorKey(author: AuthorInfo): string {
  return `${author.name}-${author.email}`
}

const SEPARATOR = `, `

function getAuthorIds(authors: AuthorInfo[]) {
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
  authors: AuthorInfo[]
  className?: string
  compact?: boolean
  large?: boolean
  subtle?: boolean
}) {
  const authorsPrimary = [] as AuthorInfo[]
  const authorsOther = [] as AuthorInfo[]
  const authorsCorresponding = [] as AuthorInfo[]
  for (const author of authors.map(convertToAuthorInfoV2)) {
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
    <div className={className}>
      <ul className={cns(!compact && 'font-semibold')}>
        {authorsPrimary.map((author, i, arr) => (
          <li key={getAuthorKey(author)} className="float-left mr-sds-xxs">
            {compact ? (
              author.name ?? author.kaggleUserName
            ) : (
              <AuthorLinkComponent author={author} large={large} />
            )}
            {!(
              authorsOther.length + authorsCorresponding.length === 0 &&
              arr.length - 1 === i
            ) && SEPARATOR}
          </li>
        ))}
      </ul>

      <ul
        className={cns(
          subtle && !compact && 'text-sds-color-primitive-gray-600',
        )}
      >
        {compact ? (
          <li className="float-left mr-sds-xxs">{otherCollapsed}</li>
        ) : (
          authorsOther.map((author, i, arr) => (
            <li key={getAuthorKey(author)} className="float-left mr-sds-xxs">
              <AuthorLinkComponent author={author} large={large} />
              {!(authorsCorresponding.length === 0 && arr.length - 1 === i) &&
                SEPARATOR}
            </li>
          ))
        )}

        {authorsCorresponding.map((author, i, arr) => (
          <li key={getAuthorKey(author)} className="float-left mr-sds-xxs">
            {compact ? (
              author.name ?? author.kaggleUserName
            ) : (
              <AuthorLinkComponent author={author} large={large} />
            )}
            {!(arr.length - 1 === i) && SEPARATOR}
          </li>
        ))}
      </ul>
    </div>
  )
}
