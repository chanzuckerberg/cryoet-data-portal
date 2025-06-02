import { EXPERIMENTAL_CONDITIONS_MOCK_DATA } from 'app/components/Deposition/mock'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { MethodTableList } from './MethodTableList'

export function ExperimentalConditionsMetadataTable() {
  const { t } = useI18n()

  return (
    <MethodTableList
      accordionId="experimental-conditions-table"
      data={EXPERIMENTAL_CONDITIONS_MOCK_DATA}
      header="experimentalConditions"
      getTableData={(data) =>
        getTableData(
          {
            label: t('sampleType'),
            values: [data.sampleType],
          },
          {
            label: t('samplePreparation'),
            values: [data.samplePreparation],
          },
          {
            label: t('pixelSize'),
            values: [data.pixelSize],
          },
          {
            label: t('gridPreparation'),
            values: [data.gridPreparation],
          },
          {
            label: t('runs'),
            values: [data.runs],
          },
        )
      }
    />
  )
}
