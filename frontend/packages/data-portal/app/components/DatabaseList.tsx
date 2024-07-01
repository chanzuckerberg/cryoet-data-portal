import { CollapsibleList } from 'app/components/CollapsibleList'
import { DatabaseEntry } from 'app/components/DatabaseEntry'

export function DatabaseList({
  entries,
  collapseAfter,
}: {
  entries?: string[]
  collapseAfter?: number
}) {
  return (
    <CollapsibleList
      entries={entries?.map((e) => ({
        key: e,
        entry: <DatabaseEntry entry={e} />,
      }))}
      collapseAfter={collapseAfter}
    />
  )
}
