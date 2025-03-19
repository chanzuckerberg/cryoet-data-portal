import { Link } from 'app/components/Link'
import {
  DatabaseType,
  LABEL_MAP,
  REGEX_MAP,
  URL_MAP,
} from 'app/constants/external-dbs'
import { TableDataValue } from 'app/types/table'
import { cns } from 'app/utils/cns'

export interface DatabaseEntryProps {
  entry: TableDataValue
  inline?: boolean
}

export function DatabaseEntry(props: DatabaseEntryProps) {
  const { entry, inline } = props
  let dbtype: DatabaseType | undefined
  let id: string = ''

  for (const [dbt, pattern] of REGEX_MAP) {
    const match = pattern.exec(String(entry))
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
    <p className="flex flex-row gap-sds-xs">
      {(!inline || dbtype === DatabaseType.DOI) && (
        <span
          className={cns(
            'text-light-sds-color-primitive-gray-900 ',
            !inline && 'font-semibold',
          )}
        >
          {LABEL_MAP.get(dbtype)}:
        </span>
      )}
      <Link
        className={
          inline
            ? 'text-light-sds-color-primitive-blue-500 truncate'
            : 'text-light-sds-color-primitive-gray-600'
        }
        to={URL_MAP.get(dbtype) + id}
        variant={inline ? undefined : 'dashed-underlined'}
      >
        {dbtype === DatabaseType.DOI ? id : entry}
      </Link>
    </p>
  )
}

export function DatabaseEntryList({ entries }: { entries: string }) {
  return (
    <ul className="flex flex-col gap-sds-xs text-sds-body-s-400-wide leading-sds-body-xs">
      {entries.split(',').map((entry) => {
        return (
          <li key={entry}>
            <DatabaseEntry entry={entry.trim()} inline />
          </li>
        )
      })}
    </ul>
  )
}
