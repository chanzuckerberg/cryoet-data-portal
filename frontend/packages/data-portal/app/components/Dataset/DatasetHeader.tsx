import { Button, Icon } from '@czi-sds/components'

import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { DatasetOverview } from 'app/components/Dataset/DatasetOverview'
import { PageHeader } from 'app/components/PageHeader'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import {
  MetadataDrawerId,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'

import { HeaderKeyPhoto } from '../HeaderKeyPhoto'

export function DatasetHeader() {
  const { dataset } = useDatasetById()
  const { toggleDrawer } = useMetadataDrawer()
  const { t } = useI18n()
  const { openDatasetDownloadModal } = useDownloadModalQueryParamState()

  return (
    <PageHeader
      actions={
        <Button
          startIcon={<Icon sdsIcon="download" sdsType="button" sdsSize="l" />}
          sdsType="primary"
          sdsStyle="rounded"
          onClick={() => openDatasetDownloadModal({ datasetId: dataset.id })}
        >
          {t('downloadDataset')}
        </Button>
      }
      breadcrumbs={<Breadcrumbs variant="dataset" data={dataset} />}
      lastModifiedDate={dataset.last_modified_date ?? dataset.deposition_date}
      metadata={[
        {
          key: t('datasetId'),
          value: String(dataset.id),
        },
      ]}
      onMoreInfoClick={() => toggleDrawer(MetadataDrawerId.Dataset)}
      releaseDate={dataset.release_date}
      title={dataset.title}
      renderHeader={({ moreInfo }) => (
        <div className="flex flex-row w-full justify-between gap-sds-xxl p-sds-xl">
          <HeaderKeyPhoto
            title={dataset.title}
            url={dataset.key_photo_url ?? undefined}
          />

          <div className="flex flex-col gap-sds-xl flex-1 min-w-[300px]">
            <DatasetOverview />

            {moreInfo}
          </div>
        </div>
      )}
    />
  )
}
