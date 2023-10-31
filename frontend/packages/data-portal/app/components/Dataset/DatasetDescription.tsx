import { Button } from '@czi-sds/components'
import clsx from 'clsx'
import { HTMLProps, useState } from 'react'

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

// use clsx here instead of cns since it erroneously merges text-sds-gray-500 and text-sds-caps-xxxs
const sectionHeaderStyles = clsx(
  'font-semibold uppercase',
  'text-sds-gray-500',
  'text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps',
)

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

interface DatabaseListProps {
  title: string
  entries?: string[]
  className?: HTMLProps<HTMLElement>['className']
  collapseAfter?: number
}

function DatabaseList(props: DatabaseListProps) {
  const { title, entries, className, collapseAfter } = props
  const collapsible =
    collapseAfter !== undefined &&
    collapseAfter >= 0 &&
    entries !== undefined &&
    entries.length > collapseAfter
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className={clsx(className, 'flex flex-col gap-sds-xs')}>
      <h3 className={sectionHeaderStyles}>{title}</h3>
      {entries ? (
        <ul
          className={clsx(
            'flex flex-col gap-sds-xxs',
            collapsible && 'transition-[max-height_0.2s_ease-out]',
          )}
        >
          {entries.map(
            (e, i) =>
              !(collapsible && collapsed && i + 1 > collapseAfter) && (
                <li>
                  <DatabaseEntry entry={e} />
                </li>
              ),
          )}
          {collapsible && (
            <div>
              <Button
                sdsType="primary"
                sdsStyle="minimal"
                onClick={() => setCollapsed(!collapsed)}
                // remove whitespace
                style={{ minWidth: 0, padding: 0 }}
              >
                {collapsed
                  ? i18n.plusMore(entries.length - collapseAfter)
                  : i18n.showLess}
              </Button>
            </div>
          )}
        </ul>
      ) : (
        <p className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-400">
          {i18n.notSubmitted}
        </p>
      )}
    </div>
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

  // clean up entries into lists
  const publicationEntries = dataset.dataset_publications
    ?.split(',')
    .map((e) => e.trim())

  const relatedDatabaseEntries = dataset.related_database_entries
    ?.split(',')
    .map((e) => e.trim())

  const envelopeIcon = (
    <EnvelopeIcon className="text-sds-gray-400 mx-sds-xxxs align-top inline-block h-sds-icon-xs w-sds-icon-xs" />
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
        <DatabaseList
          title={i18n.publications}
          entries={publicationEntries}
          className="flex-1 max-w-[260px]"
        />
        <DatabaseList
          title={i18n.relatedDatabases}
          entries={relatedDatabaseEntries}
          collapseAfter={1}
          className="flex-1 max-w-[260px]"
        />
        {/* extra div to turn it into 3 columns */}
        <div className="flex-1" />
      </div>
    </div>
  )
}
