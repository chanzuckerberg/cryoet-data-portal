import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { TOMOGRAM_METHOD_MOCK_DATA } from '../mock'
import { MethodTableList } from './MethodTableList'

export function TomogramMethodsMetadataTable() {
  const { t } = useI18n()

  return (
    <MethodTableList
      accordionId="tomogram-methods-table"
      data={TOMOGRAM_METHOD_MOCK_DATA}
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
            values: [data.postProcessing],
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
