import { Icon } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'

import { Link } from 'app/components/Link'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

export function DatasetHeader() {
  const [params] = useSearchParams()
  const previousUrl = params.get('prev')
  const dataset = useDatasetById()

  return (
    <header className="flex flex-col items-center justify-center w-full min-h-[48px]">
      <div
        className={cns(
          'flex items-center',
          'px-sds-xl py-sds-l',
          'w-full max-w-content',
          previousUrl ? 'justify-between' : 'justify-end',
        )}
      >
        {previousUrl && (
          <Link className="flex items-center gap-1" to={previousUrl}>
            <Icon
              sdsIcon="chevronLeft"
              sdsSize="xs"
              sdsType="iconButton"
              className="!w-[10px] !h-[10px] !fill-sds-primary-400"
            />
            <span className="text-sds-primary-400 font-semibold text-sm">
              Back to results
            </span>
          </Link>
        )}

        <div className="flex items-center gap-sds-xs text-xs text-sds-gray-600">
          <p>{i18n.releaseDate(dataset.release_date)}</p>
          <div className="h-3 w-px bg-sds-gray-400" />
          <p>
            {i18n.lastModified(
              dataset.last_modified_date ?? dataset.deposition_date,
            )}
          </p>
        </div>
      </div>
    </header>
  )
}
