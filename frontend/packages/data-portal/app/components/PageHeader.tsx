import { Button } from '@czi-sds/components'
import { ReactNode } from 'react'

import { InlineMetadata, Metadata } from 'app/components/InlineMetadata'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

export function PageHeader({
  actions,
  breadcrumbs,
  lastModifiedDate,
  metadata = [],
  onMoreInfoClick,
  releaseDate,
  renderHeader,
  title,
}: {
  actions?: ReactNode
  breadcrumbs?: ReactNode
  lastModifiedDate?: string
  metadata?: Metadata[]
  onMoreInfoClick?(): void
  releaseDate?: string
  renderHeader?({ moreInfo }: { moreInfo?: ReactNode }): ReactNode
  title: ReactNode
}) {
  const { t } = useI18n()

  return (
    <div className="flex flex-auto justify-center grow-0">
      <header className="flex flex-col items-center w-full min-h-[48 x]">
        <div className="flex flex-col justify-start w-full pb-sds-xl">
          <div
            className={cns(
              'flex justify-center',
              'border-b-[3px] border-[#d9d9d9]',
            )}
          >
            <div
              className={cns(
                // create grid with fit content 1st row / 2nd col
                'grid grid-cols-[minmax(0,_1fr)_auto] grid-rows-[1fr_auto]',
                'w-full max-w-content',
                'justify-between',
                'gap-x-sds-xxl',
                'px-sds-xl pt-sds-l pb-sds-xxs',
              )}
            >
              {breadcrumbs}

              <div className="col-start-1 row-start-2 flex flex-col gap-sds-xxs min-w-full">
                <h1
                  className={cns(
                    'font-semibold',
                    'text-sds-header-xxl leading-sds-header-xxl',
                    'max-w-[1000px]',
                  )}
                >
                  {title}
                </h1>

                {metadata.length > 0 && (
                  <InlineMetadata fields={metadata} subheader />
                )}
              </div>

              {/* dates */}
              {(releaseDate || lastModifiedDate) && (
                <div
                  className={cns(
                    'row-start-1 col-start-2',
                    'flex items-start justify-end gap-sds-xs',
                    'text-xs text-sds-gray-600',
                  )}
                >
                  {releaseDate && (
                    <p>
                      {t('releaseDate')}: {releaseDate}
                    </p>
                  )}

                  {releaseDate && lastModifiedDate && (
                    <div className="h-3 w-px bg-sds-gray-400" />
                  )}

                  {lastModifiedDate && (
                    <p>
                      {t('lastModified')}: {lastModifiedDate}
                    </p>
                  )}
                </div>
              )}

              {/* actions */}
              <div className="flex flex-row row-start-2 col-start-2 gap-sds-m justify-end items-start min-w-[315px]">
                {actions}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex flex-auto max-w-content">
              {renderHeader?.({
                moreInfo: onMoreInfoClick && (
                  <div className="flex w-full">
                    <Button
                      className="flex items-center gap-sds-xxs"
                      sdsType="secondary"
                      sdsStyle="rounded"
                      onClick={onMoreInfoClick}
                    >
                      <span>{t('viewAllInfo')}</span>
                    </Button>
                  </div>
                ),
              })}
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
