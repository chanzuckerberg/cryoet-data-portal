import { Button, Icon } from '@czi-sds/components'
import { useSearchParams } from '@remix-run/react'

import { DatasetDescription } from 'app/components/Dataset/DatasetDescription'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'
import { useDatasetDrawer } from 'app/state/drawer'
import { cns } from 'app/utils/cns'

export function DatasetHeader() {
  const [params] = useSearchParams()
  const previousUrl = params.get('prev')
  const { dataset } = useDatasetById()
  const drawer = useDatasetDrawer()

  return (
    <div className="flex flex-auto justify-center px-sds-xl pt-sds-l pb-sds-xxl">
      <header
        className={cns(
          'flex flex-col items-center justify-center',
          'w-full min-h-[48px] max-w-content',
        )}
      >
        <div className="flex flex-col justify-start gap-sds-xxl w-full">
          <div
            className={cns(
              // create grid with fit content 1st row / 2nd col
              'grid grid-cols-[1fr_auto] grid-rows-[1fr_auto]',
              'w-full',
              'justify-between',
              'gap-x-sds-xxl',
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
                    Back to Results
                  </span>
                </Link>
              </div>
            )}
            <div className="col-start-1 row-start-2 flex flex-col gap-sds-xxs">
              {/* dataset title */}
              <h1
                className={cns(
                  'font-semibold',
                  'text-sds-header-xxl leading-sds-header-xxl',
                  'max-w-[1000px]',
                )}
              >
                {dataset.title}
              </h1>
              {/* portal ID */}
              <div className="flex flex-row items-center justify-left gap-sds-xxs text-sds-gray-500">
                <p className="font-semibold uppercase text-sds-caps-xxs leading-sds-caps-xxs tracking-sds-caps">
                  {i18n.portalIdBlank}
                </p>
                <p className="text-sds-body-s leading-sds-body-s">
                  {dataset.id}
                </p>
              </div>
            </div>

            {/* dates */}
            <div
              className={cns(
                'row-start-1 col-start-2',
                'flex items-center justify-end gap-sds-xs',
                'text-xs text-sds-gray-600',
                'my-sds-l',
              )}
            >
              <p>{i18n.releaseDate(dataset.release_date)}</p>
              <div className="h-3 w-px bg-sds-gray-400" />
              <p>
                {i18n.lastModified(
                  dataset.last_modified_date ?? dataset.deposition_date,
                )}
              </p>
            </div>

            {/* actions */}
            <div className="flex flex-row row-start-2 col-start-2 gap-sds-m justify-between min-w-[315px]">
              <Button
                startIcon={
                  <Icon sdsIcon="download" sdsType="button" sdsSize="l" />
                }
                sdsType="primary"
                sdsStyle="rounded"
              >
                Download Dataset
              </Button>
              <Button
                startIcon={
                  <Icon sdsIcon="infoCircle" sdsType="button" sdsSize="l" />
                }
                sdsType="secondary"
                sdsStyle="rounded"
                onClick={drawer.toggle}
              >
                More Info
              </Button>
            </div>
          </div>

          <div className="flex flex-row gap-sds-xxl">
            <div className="flex-1 min-w-[300px]">
              <DatasetDescription />
            </div>

            <div className="flex-1 flex w-full">
              <div className="flex-initial w-sds-xxl" />
              <div className="flex-shrink-0 w-full max-w-[465px]">
                <KeyPhoto title={dataset.title} src="https://cataas.com/cat" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
