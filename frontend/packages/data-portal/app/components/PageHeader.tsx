import { Button, Icon } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'
import { ReactNode } from 'react'

import { Link } from 'app/components/Link'
import { i18n } from 'app/i18n'
import { cns } from 'app/utils/cns'

interface PageHeaderMetadata {
  key: string
  value: string
}

export function PageHeader({
  actions,
  backToResultsLabel = i18n.backToResults,
  children,
  lastModifiedDate,
  metadata = [],
  onMoreInfoClick,
  releaseDate,
  title,
}: {
  actions?: ReactNode
  backToResultsLabel?: string
  children?: ReactNode
  lastModifiedDate?: string
  metadata?: PageHeaderMetadata[]
  onMoreInfoClick?(): void
  releaseDate?: string
  title: ReactNode
}) {
  const [params] = useSearchParams()
  const previousUrl = params.get('prev')

  return (
    <div className="flex flex-auto justify-center">
      <header
        className={cns(
          'flex flex-col items-center',
          'w-full min-h-[48px] max-w-content',
        )}
      >
        <div className="flex flex-col justify-start w-full">
          <div
            className={cns(
              // create grid with fit content 1st row / 2nd col
              'grid grid-cols-[1fr_auto] grid-rows-[1fr_auto]',
              'w-full',
              'justify-between',
              'gap-x-sds-xxl',
              'px-sds-xl pt-sds-l pb-sds-xxl',
            )}
          >
            {/* back button */}
            {previousUrl && (
              <div className="flex items-center">
                <Link
                  className="flex items-center gap-sds-xxs"
                  to={previousUrl}
                >
                  <Icon
                    sdsIcon="chevronLeft"
                    sdsSize="xs"
                    sdsType="iconButton"
                    className="!w-[10px] !h-[10px] !fill-sds-primary-400"
                  />
                  <span className="text-sds-primary-400 font-semibold text-sds-header-s leading-sds-header-s">
                    {backToResultsLabel}
                  </span>
                </Link>
              </div>
            )}

            <div className="col-start-1 row-start-2 flex flex-col gap-sds-xxs">
              <h1
                className={cns(
                  'font-semibold',
                  'text-sds-header-xxl leading-sds-header-xxl',
                  'max-w-[1000px]',
                )}
              >
                {title}
              </h1>

              {/* metadata */}
              {metadata.length > 0 && (
                <ul className="list-none flex gap-sds-l">
                  {metadata.map(({ key, value }) => (
                    <li
                      className="flex flex-row items-center justify-left gap-sds-xxs text-sds-gray-500"
                      key={key + value}
                    >
                      <span className="font-semibold text-sds-caps-xxs leading-sds-caps-xxs tracking-sds-caps">
                        {key}:
                      </span>

                      <span className="text-sds-body-s leading-sds-body-s">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* dates */}
            {(releaseDate || lastModifiedDate) && (
              <div
                className={cns(
                  'row-start-1 col-start-2',
                  'flex items-center justify-end gap-sds-xs',
                  'text-xs text-sds-gray-600',
                  'my-sds-l',
                )}
              >
                {releaseDate && <p>{i18n.releaseDate(releaseDate)}</p>}

                <div className="h-3 w-px bg-sds-gray-400" />

                {lastModifiedDate && (
                  <p>{i18n.lastModified(lastModifiedDate)}</p>
                )}
              </div>
            )}

            {/* actions */}
            <div className="flex flex-row row-start-2 col-start-2 gap-sds-m justify-between min-w-[315px]">
              {actions}

              <Button
                startIcon={
                  <Icon sdsIcon="infoCircle" sdsType="button" sdsSize="l" />
                }
                sdsType="secondary"
                sdsStyle="rounded"
                onClick={onMoreInfoClick}
              >
                More Info
              </Button>
            </div>
          </div>

          {children}
        </div>
      </header>
    </div>
  )
}
