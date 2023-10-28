import clsx from 'clsx'

import { EnvelopeIcon } from 'app/components/icons'
import { Link } from 'app/components/Link'
import {
  DatabaseType,
  LABEL_MAP,
  REGEX_MAP,
  URL_MAP,
} from 'app/constants/external-dbs'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'

interface DatabaseEntryProps {
  entry: string
}

function DatabaseEntry(props: DatabaseEntryProps) {
  const { entry } = props
  let dbtype: DatabaseType | undefined
  let id: string = ''

  for (const [dbt, pattern] of REGEX_MAP) {
    const match = pattern.exec(entry)
    if (match !== null) {
      dbtype = dbt
      // eslint-disable-next-line prefer-destructuring
      id = match[1]
      break
    }
  }

  if (dbtype === undefined) {
    return <p>{entry}</p>
  }

  return (
    <p className="text-sds-body-xxs leading-sds-body-xxs flex flex-row gap-sds-xs">
      <span className="text-sds-gray-black font-semibold">
        {LABEL_MAP.get(dbtype)}:
      </span>
      <Link className="text-sds-primary-400" to={URL_MAP.get(dbtype) + id}>
        {entry}
      </Link>
    </p>
  )
}

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

  const publicationEntries = dataset.dataset_publications
    ?.split(',')
    .map((e) => e.trim())

  const relatedDatabaseEntries = dataset.related_database_entries
    ?.split(',')
    .map((e) => e.trim())

  const envelopeIcon = (
    <EnvelopeIcon className="text-sds-gray-400 ml-sds-xxxs align-top inline-block h-sds-icon-xs w-sds-icon-xs" />
  )

  // use clsx here instead of cns since it erroneously merges text-sds-gray-500 and text-sds-caps-xxxs
  const sectionHeaderStyles = clsx(
    'font-semibold uppercase',
    'text-sds-gray-500',
    'text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps',
  )

  const notSubmittedText = (
    <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-400">
      {i18n.notSubmitted}
    </p>
  )

  return (
    <div className="flex flex-col w-full gap-sds-xl">
      <p className="text-sds-body-m leading-sds-body-m">
        {dataset.description}
      </p>
      <div className="flex flex-col gap-sds-xs">
        <h3 className={sectionHeaderStyles}>{i18n.authors}</h3>
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
      <div className="flex flex-row gap-sds-xxl">
        <div className="flex-1 max-w-[260px] flex flex-col gap-sds-xs">
          <h3 className={sectionHeaderStyles}>{i18n.publications}</h3>
          {publicationEntries ? (
            <ul>
              {publicationEntries.map((e) => (
                <li>
                  <DatabaseEntry entry={e} />
                </li>
              ))}
            </ul>
          ) : (
            notSubmittedText
          )}
        </div>
        <div className="flex-1 max-w-[260px] flex flex-col gap-sds-xs">
          <h3 className={sectionHeaderStyles}>{i18n.relatedDatabases}</h3>
          {relatedDatabaseEntries ? (
            <ul>
              {relatedDatabaseEntries.map((e) => (
                <li>
                  <DatabaseEntry entry={e} />
                </li>
              ))}
            </ul>
          ) : (
            notSubmittedText
          )}
        </div>
        <div className="flex-1" />
      </div>
    </div>
  )
}
