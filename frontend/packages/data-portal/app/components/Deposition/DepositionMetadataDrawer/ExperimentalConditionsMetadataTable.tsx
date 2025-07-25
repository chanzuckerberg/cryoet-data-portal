import { CollapsibleDescription } from 'app/components/common/CollapsibleDescription/CollapsibleDescription'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { MethodTableList } from './MethodTableList'

export function ExperimentalConditionsMetadataTable() {
  const { t } = useI18n()
  const { experimentalConditions } = useDepositionById()

  return (
    <MethodTableList
      accordionId="experimental-conditions-table"
      data={experimentalConditions}
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
            renderValue: (value: string) => (
              <CollapsibleDescription text={value} />
            ),
          },
          {
            label: t('pixelSize'),
            values: [data.pixelSize],
          },
          {
            label: t('gridPreparation'),
            values: [data.gridPreparation],
            renderValue: (value: string) => (
              <CollapsibleDescription text={value} />
            ),
          },
          {
            label: t('runs'),
            values: [data.count],
          },
        )
      }
    />
  )
}
