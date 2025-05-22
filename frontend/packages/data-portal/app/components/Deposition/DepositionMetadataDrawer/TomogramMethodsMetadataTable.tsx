import { useI18n } from 'app/hooks/useI18n'
import { getTableData } from 'app/utils/table'

import { MethodTableList } from './MethodTableList'

interface TomogramTableData {
  tomogram: number
  voxelSpacing: number
  reconstructionMethod: string
  postProcessing: string
  ctfCorrected: boolean
}

const MOCK_DATA: TomogramTableData[] = [
  {
    tomogram: 30,
    voxelSpacing: 4.99,
    reconstructionMethod: 'WBP',
    postProcessing: 'Denoised',
    ctfCorrected: false,
  },
  {
    tomogram: 30,
    voxelSpacing: 4.99,
    reconstructionMethod: 'SIRT',
    postProcessing: 'Denoised',
    ctfCorrected: true,
  },
]

export function TomogramMethodsMetadataTable() {
  const { t } = useI18n()

  return (
    <MethodTableList
      accordionId="tomogram-methods-table"
      data={MOCK_DATA}
      header="tomogramMethods"
      getTableData={(data) =>
        getTableData(
          {
            label: t('tomogram'),
            values: [data.tomogram],
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
