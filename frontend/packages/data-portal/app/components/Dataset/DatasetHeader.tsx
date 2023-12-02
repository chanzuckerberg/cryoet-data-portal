import { Button, Icon } from '@czi-sds/components'

import { DatasetDescription } from 'app/components/Dataset/DatasetDescription'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { PageHeader } from 'app/components/PageHeader'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import { useDrawer } from 'app/state/drawer'

export function DatasetHeader() {
  const { dataset } = useDatasetById()
  const drawer = useDrawer()
  const { t } = useI18n()
  const { openDatasetDownloadModal } = useDownloadModalQueryParamState()

  return (
    <PageHeader
      actions={
        <Button
          startIcon={<Icon sdsIcon="download" sdsType="button" sdsSize="l" />}
          sdsType="primary"
          sdsStyle="rounded"
          onClick={openDatasetDownloadModal}
        >
          {t('downloadDataset')}
        </Button>
      }
      lastModifiedDate={dataset.last_modified_date ?? dataset.deposition_date}
      metadata={[
        {
          key: t('portalId'),
          value: String(dataset.id),
          uppercase: true,
        },
      ]}
      onMoreInfoClick={() => drawer.setActiveDrawerId('dataset-metadata')}
      releaseDate={dataset.release_date}
      title={dataset.title}
    >
      <div className="flex flex-row justify-between gap-sds-xxl px-sds-xl pb-sds-xxl">
        <div className="flex-1 min-w-[300px]">
          <DatasetDescription />
        </div>

        {/* 465 + 38 = 503px */}
        <div className="flex-1 max-w-[503px] text-right">
          <div className="max-w-[465px] w-full inline-block">
            <KeyPhoto
              title={dataset.title}
              src={dataset.key_photo_url ?? undefined}
            />
          </div>
        </div>
      </div>
    </PageHeader>
  )
}
