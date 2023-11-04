import { Link } from 'app/components/Link'
import {
  DatabaseType,
  LABEL_MAP,
  REGEX_MAP,
  URL_MAP,
} from 'app/constants/external-dbs'

interface DatabaseEntryProps {
  entry: string
  inline?: boolean
}

export function DatabaseEntry(props: DatabaseEntryProps) {
  const { entry, inline } = props
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
      {(!inline || dbtype === DatabaseType.DOI) && (
        <span className="text-sds-gray-black font-semibold">
          {LABEL_MAP.get(dbtype)}:
        </span>
      )}
      <Link className="text-sds-info-400" to={URL_MAP.get(dbtype) + id}>
        {entry}
      </Link>
    </p>
  )
}
