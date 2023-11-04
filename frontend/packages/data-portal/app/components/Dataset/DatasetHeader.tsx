import { Button, Icon } from '@czi-sds/components'

import { DatasetDescription } from 'app/components/Dataset/DatasetDescription'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { PageHeader } from 'app/components/PageHeader'
import { useDatasetById } from 'app/hooks/useDatasetById'
import { i18n } from 'app/i18n'
import { useDrawer } from 'app/state/drawer'

export function DatasetHeader() {
  const { dataset } = useDatasetById()
  const drawer = useDrawer()

  return (
    <PageHeader
      actions={
        <Button
          startIcon={<Icon sdsIcon="download" sdsType="button" sdsSize="l" />}
          sdsType="primary"
          sdsStyle="rounded"
        >
          {i18n.downloadDataset}
        </Button>
      }
      lastModifiedDate={dataset.last_modified_date ?? dataset.deposition_date}
      metadata={[{ key: i18n.portalIdBlank, value: String(dataset.id) }]}
      onMoreInfoClick={drawer.toggle}
      releaseDate={dataset.release_date}
      title={dataset.title}
    >
      <div className="flex flex-row justify-between px-sds-xl pb-sds-xxl">
        <div className="flex-1 min-w-[300px]">
          <DatasetDescription />
        </div>

        <div className="flex-1 w-full max-w-[465px]">
          <KeyPhoto title={dataset.title} src="https://cataas.com/cat" />
        </div>
      </div>
    </PageHeader>
  )
}
