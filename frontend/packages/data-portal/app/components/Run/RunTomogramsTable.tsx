/* eslint-disable react/no-unstable-nested-components */

import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'

import { I18n } from 'app/components/I18n'
import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { usePostProcessingColumn } from 'app/components/TomogramsTable/usePostProcessingColumn'
import { useReconstructionMethodColumn } from 'app/components/TomogramsTable/useReconstructionMethodColumn'
import { useTomogramActionsColumn } from 'app/components/TomogramsTable/useTomogramActionsColumn'
import { useTomogramKeyPhotoColumn } from 'app/components/TomogramsTable/useTomogramKeyPhotoColumn'
import { useTomogramNameColumn } from 'app/components/TomogramsTable/useTomogramNameColumn'
import { useVoxelSpacingColumn } from 'app/components/TomogramsTable/useVoxelSpacingColumn'
import { Tooltip } from 'app/components/Tooltip'
import { IdPrefix } from 'app/constants/idPrefixes'
import { TomogramTableWidths } from 'app/constants/table'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import {
  MetadataDrawerId,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import { metadataDrawerTomogramAtom } from 'app/state/metadataDrawerTomogram'
import { TomogramV2 } from 'app/types/gql/runPageTypes'
import { cnsNoMerge } from 'app/utils/cns'

export function RunTomogramsTable() {
  const { t } = useI18n()
  const { tomograms, run } = useRunById()

  const { openDrawer } = useMetadataDrawer()
  const [, setMetadataDrawerTomogram] = useAtom(metadataDrawerTomogramAtom)

  const { openTomogramDownloadModal } = useDownloadModalQueryParamState()

  const openMetadataDrawer = useCallback(
    (tomogram: TomogramV2) => {
      setMetadataDrawerTomogram(tomogram)
      openDrawer(MetadataDrawerId.Tomogram)
    },
    [setMetadataDrawerTomogram, openDrawer],
  )

  const tomogramKeyPhotoColumn = useTomogramKeyPhotoColumn(
    TomogramTableWidths.photo,
  )

  const tomogramNameColumn = useTomogramNameColumn({
    showAuthors: true,
    width: TomogramTableWidths.name,
  })

  const voxelSpacingColumn = useVoxelSpacingColumn(
    TomogramTableWidths.voxelSpacing,
  )

  const reconstructionMethodColumn = useReconstructionMethodColumn(
    TomogramTableWidths.reconstructionMethod,
  )

  const postProcessingColumn = usePostProcessingColumn(
    TomogramTableWidths.postProcessing,
  )

  const tomogramActionsColumn = useTomogramActionsColumn({
    width: TomogramTableWidths.actions,

    getPlausibleData: () => ({
      datasetId: run.dataset?.id ?? 0,
      organism: run.dataset?.organismName ?? 'None',
      runId: run.id,
    }),

    onDownloadClick(tomogram) {
      openTomogramDownloadModal({
        tomogramId: tomogram.id,
        datasetId: run.dataset?.id,
        runId: run.id,
      })
    },

    onInfoClick(tomogram) {
      openMetadataDrawer(tomogram)
    },
  })

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<TomogramV2>()
    return [
      tomogramKeyPhotoColumn,
      tomogramNameColumn,

      columnHelper.accessor('deposition.depositionDate', {
        header: () => (
          <CellHeader
            className="whitespace-nowrap text-ellipsis"
            width={TomogramTableWidths.depositionDate}
          >
            {t('depositionDate')}
          </CellHeader>
        ),
        cell: ({ getValue }) => (
          <TableCell width={TomogramTableWidths.depositionDate}>
            <div>{getValue().split('T')[0]}</div>
          </TableCell>
        ),
      }),
      columnHelper.accessor('alignment.id', {
        header: () => (
          <CellHeader
            width={TomogramTableWidths.alignment}
            tooltip={<I18n i18nKey="alignmentIdTooltip" />}
          >
            {t('alignmentId')}
          </CellHeader>
        ),
        cell: ({ getValue, row: { original: tomogram } }) => (
          <TableCell width={TomogramTableWidths.alignment}>
            <p>
              {IdPrefix.Alignment}-{getValue()}
            </p>

            {tomogram.isPortalStandard && (
              <Tooltip tooltip={<I18n i18nKey="alignmentIdTooltip" />}>
                <p
                  className={cnsNoMerge(
                    'text-sds-body-xxs-400-wide leading-sds-body-xxs text-light-sds-color-semantic-base-text-secondary',
                    'underline underline-offset-4 decoration-dashed',
                  )}
                >
                  {t('canonical')}
                </p>
              </Tooltip>
            )}
          </TableCell>
        ),
      }),

      voxelSpacingColumn,
      reconstructionMethodColumn,
      postProcessingColumn,
      tomogramActionsColumn,
    ] as ColumnDef<TomogramV2>[] // https://github.com/TanStack/table/issues/4382
  }, [
    tomogramKeyPhotoColumn,
    tomogramNameColumn,
    voxelSpacingColumn,
    reconstructionMethodColumn,
    postProcessingColumn,
    tomogramActionsColumn,
    t,
  ])

  return <PageTable data={tomograms} columns={columns} hoverType="none" />
}
