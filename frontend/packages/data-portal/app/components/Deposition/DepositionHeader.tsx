import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { KeyPhoto } from 'app/components/KeyPhoto'
import { PageHeader } from 'app/components/PageHeader'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import {
  MetadataDrawerId,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'

import { DepositionOverview } from './DepositionOverview'

export function DepositionHeader() {
  const { deposition } = useDepositionById()
  const { toggleDrawer } = useMetadataDrawer()
  const { t } = useI18n()

  return (
    <PageHeader
      breadcrumbs={<Breadcrumbs variant="deposition" data={deposition} />}
      lastModifiedDate={
        deposition?.last_modified_date ?? deposition?.deposition_date
      }
      metadata={[
        {
          key: t('depositionId'),
          value: `${IdPrefix.Deposition}-${deposition.id}`,
        },
      ]}
      onMoreInfoClick={() => toggleDrawer(MetadataDrawerId.Deposition)}
      releaseDate={deposition.release_date}
      title={deposition.title}
      renderHeader={({ moreInfo }) => (
        <div className="flex flex-row w-full justify-between gap-sds-xxl p-sds-xl">
          <div className="max-w-[465px] max-h-[330px] grow">
            <KeyPhoto
              title={deposition.title}
              src={deposition.key_photo_url ?? undefined}
            />
          </div>

          <div className="flex flex-col gap-sds-xl flex-1 min-w-[300px]">
            <DepositionOverview />

            {moreInfo}
          </div>
        </div>
      )}
    />
  )
}
