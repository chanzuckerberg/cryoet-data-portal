import { Fragment, useMemo } from 'react'

import { AuthorInfo } from 'app/components/AuthorLink'
import { EnvelopeIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { cns } from 'app/utils/cns'

function getAuthorKey(author: AuthorInfo) {
  return author.name + author.email
}

export function DatasetAuthors({
  authors,
  className,
  separator = ';',
  compact = false,
  subtle = false,
}: {
  authors: AuthorInfo[]
  className?: string
  separator?: string
  compact?: boolean
  subtle?: boolean
}) {
  // TODO: make the below grouping more efficient and/or use GraphQL ordering
  const authorsPrimary = authors.filter(
    (author) => author.primary_author_status,
  )
  const authorsCorresponding = authors.filter(
    (author) => author.corresponding_author_status,
  )
  const authorsOther = authors.filter(
    (author) =>
      !(author.primary_author_status || author.corresponding_author_status),
  )

  const envelopeIcon = (
    <EnvelopeIcon className="text-sds-gray-400 mx-sds-xxxs align-top inline-block h-sds-icon-xs w-sds-icon-xs" />
  )

  const otherCollapsed = useMemo<string | null>(() => {
    const ellipsis = '...'

    if (compact && authorsOther.length > 0) {
      if (authorsCorresponding.length === 0) {
        return ellipsis
      }
      return `${ellipsis} ${separator} `
    }
    return null
  }, [authorsOther, authorsCorresponding, compact, separator])

  // TODO: let's find a better way of doing this
  return (
    <p className={className}>
      <span className={cns(!compact && 'font-semibold')}>
        {authorsPrimary.map((author, i, arr) => (
          <Fragment key={getAuthorKey(author)}>
            {author.name}
            {!(
              authorsOther.length + authorsCorresponding.length === 0 &&
              arr.length - 1 === i
            ) && `${separator} `}
          </Fragment>
        ))}
      </span>
      <span className={cns(subtle && !compact && 'text-sds-gray-600')}>
        {compact
          ? otherCollapsed
          : authorsOther.map((author, i, arr) => (
              <Fragment key={getAuthorKey(author)}>
                {author.name}
                {!(authorsCorresponding.length === 0 && arr.length - 1 === i) &&
                  `${separator} `}
              </Fragment>
            ))}
        {authorsCorresponding.map((author, i, arr) => (
          <Fragment key={getAuthorKey(author)}>
            {author.name}
            {!compact &&
              (author.email ? (
                <Link to={`mailto:${author.email}`}>{envelopeIcon}</Link>
              ) : (
                envelopeIcon
              ))}
            {!(arr.length - 1 === i) && `${separator} `}
          </Fragment>
        ))}
      </span>
    </p>
  )
}
