import { Button } from '@czi-sds/components'
import { useState } from 'react'

import { DatabaseEntry } from 'app/components/DatabaseEntry'
import { DOI_ID } from 'app/constants/external-links'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'
import { cns, cnsNoMerge } from 'app/utils/cns'

import { DatasetAuthors } from './DatasetAuthors'

// use clsx here instead of cns since it erroneously merges text-sds-gray-500 and text-sds-caps-xxxs
const sectionHeaderStyles = cnsNoMerge(
  'font-semibold uppercase',
  'text-sds-gray-500',
  'text-sds-caps-xxxs leading-sds-caps-xxxs tracking-sds-caps',
)

interface DatabaseListProps {
  title: string
  entries?: string[]
  className?: string
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
    <div className={cns(className, 'flex flex-col gap-sds-xs')}>
      <h3 className={sectionHeaderStyles}>{title}</h3>
      {entries ? (
        <ul
          className={cns(
            'flex flex-col gap-sds-xxs',
            collapsible && 'transition-[max-height_0.2s_ease-out]',
          )}
        >
          {entries.map(
            (e, i) =>
              !(collapsible && collapsed && i + 1 > collapseAfter) && (
                <li className="text-sds-body-xxs leading-sds-body-xxs" key={e}>
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

  // clean up entries into lists
  const publicationEntries = dataset.dataset_publications
    ?.split(',')
    .map((e) => e.trim())
    .filter((e) => DOI_ID.exec(e)) // only show DOI links

  const relatedDatabaseEntries = dataset.related_database_entries
    ?.split(',')
    .map((e) => e.trim())

  return (
    <div className="flex flex-col gap-sds-xl">
      <p className="text-sds-body-m leading-sds-body-m">
        {dataset.description}
      </p>
      <div className="flex flex-col gap-sds-xs">
        <h3 className={sectionHeaderStyles}>{i18n.authors}</h3>
        <DatasetAuthors
          authors={dataset.authors}
          className="text-sds-body-xxs leading-sds-body-xxs"
        />
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
