import { Fragment, useMemo } from 'react'

import { AuthorInfo, AuthorLink } from 'app/components/AuthorLink'
import { cns } from 'app/utils/cns'

function getAuthorKey(author: AuthorInfo) {
  return author.name + author.email
}

export function DatasetAuthors({
  authors,
  className,
  separator = ',',
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

  const separatorNode = `${separator} `

  // TODO: let's find a better way of doing this
  return (
    <p className={className}>
      <span className={cns(!compact && 'font-semibold')}>
        {authorsPrimary.map((author, i, arr) => (
          <Fragment key={getAuthorKey(author)}>
            {compact ? author.name : <AuthorLink author={author} />}
            {!(
              authorsOther.length + authorsCorresponding.length === 0 &&
              arr.length - 1 === i
            ) && separatorNode}
          </Fragment>
        ))}
      </span>

      <span className={cns(subtle && !compact && 'text-sds-gray-600')}>
        {compact
          ? otherCollapsed
          : authorsOther.map((author, i, arr) => (
              <Fragment key={getAuthorKey(author)}>
                <AuthorLink author={author} />
                {!(authorsCorresponding.length === 0 && arr.length - 1 === i) &&
                  separatorNode}
              </Fragment>
            ))}

        {authorsCorresponding.map((author, i, arr) => (
          <Fragment key={getAuthorKey(author)}>
            {compact ? author.name : <AuthorLink author={author} />}
            {!(arr.length - 1 === i) && separatorNode}
          </Fragment>
        ))}
      </span>
    </p>
  )
}
