import { useDepositionById } from 'app/hooks/useDepositionById'
import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { MethodTableList } from './MethodTableList'

export function TomogramMethodsMetadataTable() {
  const { t } = useI18n()
  const { tomogramMethods } = useDepositionById()

  return (
    <MethodTableList
      accordionId="tomogram-methods-table"
      data={tomogramMethods}
      header="tomogramMethods"
      getTableData={(data) =>
        getTableData(
          {
            label: t('tomogram'),
            values: [data.count],
          },
          {
            label: t('voxelSpacing'),
            values: [t('unitAngstrom', { value: data.voxelSpacing })],
          },
          {
            label: t('reconstructionMethod'),
            values: [data.reconstructionMethod],
          },
          {
            label: t('postProcessing'),
            values: [data.processing],
          },
          {
            label: t('ctfCorrected'),
            values: [t(data.ctfCorrected ? 'true' : 'false')],
          },
        )
      }
    />
  )
}
