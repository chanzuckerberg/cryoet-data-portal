import { Button, Icon } from '@czi-sds/components'

import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { CitationButton } from 'app/components/CitationButton'
import { DatasetOverview } from 'app/components/Dataset/DatasetOverview'
import { PageHeader } from 'app/components/PageHeader'
import { DATA_TYPES } from 'app/constants/dataTypes'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import {
  MetadataDrawerId,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'

import { HeaderKeyPhoto } from '../HeaderKeyPhoto'
import { getKeyPhotoCaption } from '../KeyPhotoCaption/KeyPhotoCaption'

export function DatasetHeader() {
  const { dataset } = useDatasetById()
  const { toggleDrawer } = useMetadataDrawer()
  const { t } = useI18n()
  const { openDatasetDownloadModal } = useDownloadModalQueryParamState()

  return (
    <PageHeader
      actions={
        <div className="flex items-center gap-2.5">
          <Button
            startIcon={<Icon sdsIcon="Download" sdsSize="l" />}
            sdsType="primary"
            sdsStyle="rounded"
            onClick={() => openDatasetDownloadModal({ datasetId: dataset.id })}
          >
            {t('downloadDataset')}
          </Button>

          <CitationButton
            buttonProps={{
              sdsStyle: 'rounded',
              sdsType: 'secondary',
              startIcon: <Icon sdsIcon="Book" sdsSize="s" />,
            }}
            tooltipPlacement="bottom"
            event={{
              cite: true,
            }}
          />
        </div>
      }
      breadcrumbs={<Breadcrumbs variant="dataset" data={dataset} />}
      lastModifiedDate={dataset.lastModifiedDate.split('T')[0]}
      metadata={[
        {
          key: t('datasetId'),
          value: `${IdPrefix.Dataset}-${dataset.id}`,
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
            caption={getKeyPhotoCaption({
              type: DATA_TYPES.DATASET,
              data: dataset,
            })}
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
