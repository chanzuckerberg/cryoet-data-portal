import { Dataset_Authors } from 'app/__generated__/graphql'
import { EnvelopeIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'

export type AuthorInfo = Pick<
  Dataset_Authors,
  'name' | 'primary_author_status' | 'corresponding_author_status' | 'email'
>

export function DatasetAuthors({
  authors,
  className,
}: {
  authors: AuthorInfo[]
  className?: string
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

  // TODO: let's find a better way of doing this
  return (
    <p className={className}>
      <span className="font-semibold">
        {authorsPrimary.map((author, i, arr) => (
          <>
            {author.name}
            {!(
              authorsOther.length + authorsCorresponding.length === 0 &&
              arr.length - 1 === i
            ) && '; '}
          </>
        ))}
      </span>
      <span className="text-sds-gray-600">
        {authorsOther.map((author, i, arr) => (
          <>
            {author.name}
            {!(authorsCorresponding.length === 0 && arr.length - 1 === i) &&
              '; '}
          </>
        ))}
        {authorsCorresponding.map((author, i, arr) => (
          <>
            {author.name}
            {author.email ? (
              <Link to={`mailto:${author.email}`}>{envelopeIcon}</Link>
            ) : (
              envelopeIcon
            )}
            {!(arr.length - 1 === i) && '; '}
          </>
        ))}
      </span>
    </p>
  )
}
