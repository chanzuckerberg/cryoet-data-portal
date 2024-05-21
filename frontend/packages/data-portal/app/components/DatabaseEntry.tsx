import { Link } from 'app/components/Link'
import {
  DatabaseType,
  LABEL_MAP,
  REGEX_MAP,
  URL_MAP,
} from 'app/constants/external-dbs'
import { TableDataValue } from 'app/types/table'
import { cns } from 'app/utils/cns'

interface DatabaseEntryProps {
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
          className={cns('text-sds-gray-black', !inline && 'font-semibold')}
        >
          {LABEL_MAP.get(dbtype)}:
        </span>
      )}
      <Link
        className={inline ? 'text-sds-info-400 truncate' : 'text-sds-gray-600'}
        to={URL_MAP.get(dbtype) + id}
        variant={inline ? undefined : 'dashed-underlined'}
      >
        {dbtype === DatabaseType.DOI ? id : entry}
      </Link>
    </p>
  )
}
