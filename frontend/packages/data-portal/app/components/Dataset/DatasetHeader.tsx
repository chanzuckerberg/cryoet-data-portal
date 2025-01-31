import { Button, Icon } from '@czi-sds/components'
import prettyBytes from 'pretty-bytes'

import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { DatasetOverview } from 'app/components/Dataset/DatasetOverview'
import { PageHeader } from 'app/components/PageHeader'
import { IdPrefix } from 'app/constants/idPrefixes'
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
        <div>
          <Button
            startIcon={<Icon sdsIcon="Download" sdsType="button" sdsSize="l" />}
            sdsType="primary"
            sdsStyle="rounded"
            onClick={() => openDatasetDownloadModal({ datasetId: dataset.id })}
          >
            {t('downloadDataset')}
          </Button>
        </div>
      }
      breadcrumbs={<Breadcrumbs variant="dataset" data={dataset} />}
      lastModifiedDate={dataset.lastModifiedDate.split('T')[0]}
      metadata={[
        {
          key: t('datasetId'),
          value: `${IdPrefix.Dataset}-${dataset.id}`,
        },
        {
          key: t('estimatedDownloadSize'),
          value: dataset.fileSize ? prettyBytes(dataset.fileSize) : 'None',
        },
      ]}
      onMoreInfoClick={() => toggleDrawer(MetadataDrawerId.Dataset)}
      releaseDate={dataset.releaseDate.split('T')[0]}
      title={dataset.title}
      renderHeader={({ moreInfo }) => (
        <div className="flex flex-row w-full justify-between gap-sds-xxl p-sds-xl">
          <HeaderKeyPhoto
            title={dataset.title}
            url={dataset.keyPhotoUrl ?? undefined}
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
