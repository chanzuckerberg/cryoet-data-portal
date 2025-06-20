import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'

import {
  type GetDepositionTomogramsQuery,
  Tomogram_Processing_Enum,
} from 'app/__generated_v2__/graphql'
import { useDepositedInColumn } from 'app/components/Deposition/useDepositedInColumn'
import { PageTable } from 'app/components/Table'
import { usePostProcessingColumn } from 'app/components/TomogramsTable/usePostProcessingColumn'
import { useReconstructionMethodColumn } from 'app/components/TomogramsTable/useReconstructionMethodColumn'
import { useTomogramActionsColumn } from 'app/components/TomogramsTable/useTomogramActionsColumn'
import { useTomogramKeyPhotoColumn } from 'app/components/TomogramsTable/useTomogramKeyPhotoColumn'
import { useTomogramNameColumn } from 'app/components/TomogramsTable/useTomogramNameColumn'
import { useVoxelSpacingColumn } from 'app/components/TomogramsTable/useVoxelSpacingColumn'
import { DepositionTomogramTableWidths } from 'app/constants/table'
import { useDepositionById } from 'app/hooks/useDepositionById'
import { useIsLoading } from 'app/hooks/useIsLoading'

type DepositionTomogramTableData =
  GetDepositionTomogramsQuery['tomograms'][number]

const LOADING_ANNOTATIONS = Array.from(
  { length: 10 },
  (_, index) =>
    ({
      id: index,
      name: `Tomogram ${index + 1}`,
      processing: Tomogram_Processing_Enum.Raw,
      reconstructionMethod: 'Unknown',
      voxelSpacing: 1.0,
      run: {
        id: index,
        name: `Run ${index + 1}`,
        dataset: {
          id: index,
          title: `Dataset ${index + 1}`,
        },
      },
    }) as DepositionTomogramTableData,
)

export function DepositionTomogramTable() {
  const { tomograms } = useDepositionById()

  const { isLoadingDebounced } = useIsLoading()

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
      data={
        isLoadingDebounced ? LOADING_ANNOTATIONS : tomograms?.tomograms ?? []
      }
      columns={columns}
      hoverType="none"
    />
  )
}
