import { ColumnDef, Row, Table as ReactTable } from '@tanstack/react-table'
import { ReactNode, useMemo } from 'react'

import {
  type GetDepositionTomogramsQuery,
  Tomogram_Processing_Enum,
} from 'app/__generated_v2__/graphql'
import { useDepositedInColumn } from 'app/components/Deposition/useDepositedInColumn'
import { PageTable } from 'app/components/Table'
import { TableClassNames } from 'app/components/Table/types'
import { usePostProcessingColumn } from 'app/components/TomogramsTable/usePostProcessingColumn'
import { useReconstructionMethodColumn } from 'app/components/TomogramsTable/useReconstructionMethodColumn'
import { useTomogramActionsColumn } from 'app/components/TomogramsTable/useTomogramActionsColumn'
import { useTomogramKeyPhotoColumn } from 'app/components/TomogramsTable/useTomogramKeyPhotoColumn'
import { useTomogramNameColumn } from 'app/components/TomogramsTable/useTomogramNameColumn'
import { useVoxelSpacingColumn } from 'app/components/TomogramsTable/useVoxelSpacingColumn'
import { DepositionTomogramTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { useIsLoading } from 'app/hooks/useIsLoading'

type DepositionTomogramTableData =
  GetDepositionTomogramsQuery['tomograms'][number]

export function DepositionTomogramTable({
  data,
  classes,
  getBeforeRowElement,
}: {
  data: DepositionTomogramTableData[]
  classes?: TableClassNames
  getBeforeRowElement?: (
    table: ReactTable<DepositionTomogramTableData>,
    row: Row<DepositionTomogramTableData>,
  ) => ReactNode
}) {
  const { t } = useI18n()
  const { isLoadingDebounced } = useIsLoading()

  const loadingAnnotations = Array.from(
    { length: 10 },
    (_, index) =>
      ({
        id: index,
        name: `${String(t('tomogram'))} ${index + 1}`,
        processing: Tomogram_Processing_Enum.Raw,
        reconstructionMethod: String(t('unknown')),
        voxelSpacing: 1.0,
        run: {
          id: index,
          name: `${String(t('run'))} ${index + 1}`,
          dataset: {
            id: index,
            title: `${String(t('dataset'))} ${index + 1}`,
          },
        },
      }) as DepositionTomogramTableData,
  )

  const keyPhotoColumn = useTomogramKeyPhotoColumn(
    DepositionTomogramTableWidths.photo,
  )

  const tomogramNameColumn = useTomogramNameColumn({
    width: DepositionTomogramTableWidths.name,
  })

  const voxelSpacingColumn = useVoxelSpacingColumn(
    DepositionTomogramTableWidths.voxelSpacing,
  )

  const reconstructionMethodColumn = useReconstructionMethodColumn(
    DepositionTomogramTableWidths.reconstructionMethod,
  )

  const postProcessingColumn = usePostProcessingColumn(
    DepositionTomogramTableWidths.postProcessing,
  )

  const depositedInColumn = useDepositedInColumn<DepositionTomogramTableData>({
    width: DepositionTomogramTableWidths.depositedIn,

    getDepositedInData: ({ run }) => ({
      datasetId: run?.dataset?.id,
      datasetTitle: run?.dataset?.title,
      runId: run?.id,
      runName: run?.name,
    }),
  })

  const tomogramActionsColumn = useTomogramActionsColumn({
    forceShowViewTomogramButton: true,
    width: DepositionTomogramTableWidths.actions,

    getPlausibleData: (tomogram) => ({
      datasetId: tomogram.run?.dataset?.id ?? 0,
      organism: tomogram.run?.dataset?.organismName ?? 'None',
      runId: tomogram.run?.id ?? 0,
    }),
  })

  const columns = useMemo(
    () =>
      [
        keyPhotoColumn,
        tomogramNameColumn,
        voxelSpacingColumn,
        reconstructionMethodColumn,
        postProcessingColumn,
        depositedInColumn,
        tomogramActionsColumn,
      ] as ColumnDef<DepositionTomogramTableData>[],
    [
      depositedInColumn,
      keyPhotoColumn,
      postProcessingColumn,
      reconstructionMethodColumn,
      tomogramActionsColumn,
      tomogramNameColumn,
      voxelSpacingColumn,
    ],
  )

  return (
    <PageTable
      data={isLoadingDebounced ? loadingAnnotations : data}
      columns={columns}
      hoverType="none"
      classes={classes}
      getBeforeRowElement={getBeforeRowElement}
    />
  )
}
