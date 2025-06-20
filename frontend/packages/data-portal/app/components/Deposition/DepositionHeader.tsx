import { Icon } from '@czi-sds/components'

import { Breadcrumbs } from 'app/components/Breadcrumbs'
import { CitationButton } from 'app/components/CitationButton'
import { HeaderKeyPhoto } from 'app/components/HeaderKeyPhoto'
import { PageHeader } from 'app/components/PageHeader'
import { DATA_TYPES } from 'app/constants/dataTypes'
import { IdPrefix } from 'app/constants/idPrefixes'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import {
  MetadataDrawerId,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'

import { getKeyPhotoCaption } from '../KeyPhotoCaption/KeyPhotoCaption'
import { DepositionOverview } from './DepositionOverview'

export function DepositionHeader() {
  const { deposition } = useDepositionById()
  const { toggleDrawer } = useMetadataDrawer()
  const { t } = useI18n()

  return (
    <PageHeader
      actions={
        <div>
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
      breadcrumbs={<Breadcrumbs variant="deposition" data={deposition} />}
      lastModifiedDate={deposition.lastModifiedDate.split('T')[0]}
      metadata={[
        {
          key: t('depositionId'),
          value: `${IdPrefix.Deposition}-${deposition.id}`,
        },
      ]}
      onMoreInfoClick={() => toggleDrawer(MetadataDrawerId.Deposition)}
      releaseDate={deposition.releaseDate.split('T')[0]}
      title={deposition.title}
      renderHeader={({ moreInfo }) => (
        <div className="flex flex-row w-full justify-between gap-sds-xxl p-sds-xl">
          <HeaderKeyPhoto
            title={deposition.title}
            url={deposition.keyPhotoUrl ?? undefined}
            caption={getKeyPhotoCaption({
              type: DATA_TYPES.DEPOSITION,
            })}
          />

          <div className="flex flex-col gap-sds-xl flex-1 min-w-[300px]">
            <DepositionOverview />

            {moreInfo}
          </div>
        </div>
      )}
    />
  )
}
