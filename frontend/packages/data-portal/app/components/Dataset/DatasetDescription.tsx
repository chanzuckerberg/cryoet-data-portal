import clsx from 'clsx'

import { EnvelopeIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'

export function DatasetDescription() {
  const { dataset } = useDatasetById()

  // TODO: make the below grouping more efficient and/or use GraphQL ordering
  const authorsPrimary = dataset.authors.filter(
    (author) => author.primary_author_status,
  )
  const authorsCorresponding = dataset.authors.filter(
    (author) => author.corresponding_author_status,
  )
  const authorsOther = dataset.authors.filter(
    (author) =>
      !(author.primary_author_status || author.corresponding_author_status),
  )

  const envelopeIcon = (
    <EnvelopeIcon className="text-sds-gray-400 align-top inline-block h-sds-icon-xs w-sds-icon-xs" />
  )

  return (
    <div className="flex flex-col w-full gap-sds-xl">
      <p className="text-sds-body-m leading-sds-body-m">
        {dataset.description}
      </p>
      <div className="flex flex-col gap-sds-xs">
        <h3
          // use clsx here instead of cns since it erroneously merges text-sds-gray-500 and text-sds-caps-xxxs
          className={clsx(
            'font-semibold uppercase',
            'text-sds-gray-500',
            'text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps',
          )}
        >
          {i18n.authors}
        </h3>
        {/* TODO: let's find a better way of doing this */}
        <p className="text-sds-body-xxs leading-sds-body-xxs">
          <span className="font-semibold">
            {authorsPrimary.map((author, i, arr) => (
              <>
                {author.name}
                {!(
                  authorsOther.length + authorsCorresponding.length === 0 &&
                  arr.length - 1 === i
                ) && <>; </>}
              </>
            ))}
          </span>
          <span className="text-sds-gray-600">
            {authorsOther.map((author, i, arr) => (
              <>
                {author.name}
                {!(
                  authorsCorresponding.length === 0 && arr.length - 1 === i
                ) && <>; </>}
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
                {!(arr.length - 1 === i) && <>; </>}
              </>
            ))}
          </span>
        </p>
      </div>
    </div>
  )
}
