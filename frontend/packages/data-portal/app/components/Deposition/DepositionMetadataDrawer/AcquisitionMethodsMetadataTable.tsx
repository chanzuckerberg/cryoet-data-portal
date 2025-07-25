import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { MethodTableList } from './MethodTableList'

export function AcquisitionMethodsMetadataTable() {
  const { t } = useI18n()
  const { acquisitionMethods } = useDepositionById()

  return (
    <MethodTableList
      accordionId="acquisition-methods-table"
      data={acquisitionMethods}
      header="acquisitionMethods"
      getTableData={(data) =>
        getTableData(
          {
            label: t('microscope'),
            values: [data.microscope],
          },
          {
            label: t('camera'),
            values: [data.camera],
          },
          {
            label: t('tiltingScheme'),
            values: [data.tiltingScheme],
          },
          {
            label: t('pixelSize'),
            values: [data.pixelSize],
          },
          {
            label: t('electronOptics'),
            values: [data.electronOptics],
          },
          {
            label: t('phasePlate'),
            values: [data.phasePlate],
          },
        )
      }
    />
  )
}
