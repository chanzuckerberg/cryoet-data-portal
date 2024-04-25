import { Button, Icon } from '@czi-sds/components'

import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { DatasetDescription } from 'app/components/Dataset/DatasetDescription'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { PageHeader } from 'app/components/PageHeader'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import {
  MetadataDrawerId,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'

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
      breadcrumbs={<Breadcrumbs variant="dataset" dataset={dataset} />}
      lastModifiedDate={dataset.last_modified_date ?? dataset.deposition_date}
      metadata={[
        {
          key: t('portalId'),
          value: String(dataset.id),
          uppercase: true,
        },
      ]}
      onMoreInfoClick={() => toggleDrawer(MetadataDrawerId.Dataset)}
      releaseDate={dataset.release_date}
      title={dataset.title}
      renderHeader={({ moreInfo }) => (
        <div className="flex flex-row justify-between gap-sds-xxl p-sds-xl">
          <div className="max-w-[465px] max-h-[330px]">
            <KeyPhoto
              title={dataset.title}
              src={dataset.key_photo_url ?? undefined}
            />
          </div>

          <div className="flex flex-col gap-sds-xl flex-1 min-w-[300px]">
            <DatasetDescription />

            {moreInfo}
          </div>
        </div>
      )}
    />
  )
}
