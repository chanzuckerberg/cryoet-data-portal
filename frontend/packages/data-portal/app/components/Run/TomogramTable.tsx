/* eslint-disable react/no-unstable-nested-components */

import { Button, Icon } from '@czi-sds/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'

import { CellHeader, PageTable, TableCell } from 'app/components/Table'
import { TomogramTableWidths } from 'app/constants/table'
import { useDownloadModalQueryParamState } from 'app/hooks/useDownloadModalQueryParamState'
import { useI18n } from 'app/hooks/useI18n'
import {
  MetadataDrawerId,
  useMetadataDrawer,
} from 'app/hooks/useMetadataDrawer'
import { useRunById } from 'app/hooks/useRunById'
import {
  metadataDrawerTomogramAtom,
  Tomogram,
} from 'app/state/metadataDrawerTomogram'
import { getNeuroglancerUrl } from 'app/utils/url'

import { AuthorList } from '../AuthorList'
import { KeyPhoto } from '../KeyPhoto'
import { ViewTomogramButton } from '../ViewTomogramButton'

export function TomogramsTable() {
  const { t } = useI18n()
  const { tomograms, run } = useRunById()

  const { toggleDrawer } = useMetadataDrawer()
  const [, setMetadataDrawerTomogram] = useAtom(metadataDrawerTomogramAtom)

  const { openTomogramDownloadModal } = useDownloadModalQueryParamState()

  const openMetadataDrawer = useCallback(
    (tomogram: Tomogram) => {
      setMetadataDrawerTomogram(tomogram)
      toggleDrawer(MetadataDrawerId.Tomogram)
    },
    [setMetadataDrawerTomogram, toggleDrawer],
  )

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Tomogram>()
    return [
      columnHelper.accessor('key_photo_url', {
        header: () => <CellHeader width={TomogramTableWidths.photo} />,
        cell: ({ row: { original } }) => (
          <TableCell width={TomogramTableWidths.photo}>
            <KeyPhoto
              className="max-w-[134px]"
              title={original.name}
              src={original.key_photo_thumbnail_url ?? undefined}
            />
          </TableCell>
        ),
      }),
      columnHelper.accessor('id', {
        header: () => (
          <CellHeader width={TomogramTableWidths.id}>
            {t('tomogramId')}
          </CellHeader>
        ),
        cell: ({ row: { original } }) => (
          <TableCell
            className="flex flex-col gap-sds-xxxs !items-start"
            width={TomogramTableWidths.id}
          >
            <div className="flex gap-sds-xs items-center">
              <p className="text-sds-body-m leading-sds-body-m font-semibold text-ellipsis line-clamp-1 break-all">
                {original.id}
              </p>
            </div>
            <div className=" text-sds-gray-600 text-sds-body-xxs leading-sds-header-xxs">
              <AuthorList authors={original.authors} compact />
            </div>
          </TableCell>
        ),
      }),
      // TODO(bchu): Switch to deposition_date when available.
      columnHelper.accessor('name', {
        id: 'deposition_date',
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
            <div>{getValue()}</div>
          </TableCell>
        ),
      }),
      // TODO(bchu): Switch to alignment_id when available.
      columnHelper.accessor('name', {
        header: () => (
          <CellHeader width={TomogramTableWidths.alignment}>
            {t('alignmentId')}
          </CellHeader>
        ),
        cell: ({ getValue }) => (
          <TableCell width={TomogramTableWidths.alignment}>
            <div>{getValue()}</div>
          </TableCell>
        ),
      }),
      columnHelper.accessor('voxel_spacing', {
        header: () => (
          <CellHeader width={TomogramTableWidths.voxelSpacing}>
            {t('voxelSpacing')}
          </CellHeader>
        ),
        cell: ({ getValue, row: { original } }) => (
          <TableCell width={TomogramTableWidths.voxelSpacing}>
            {t('unitAngstrom', { value: getValue() })}
            <div className="text-sds-body-xxs leading-sds-body-xxs text-sds-gray-600">
              ({original.size_x}, {original.size_y}, {original.size_z})px
            </div>
          </TableCell>
        ),
      }),
      columnHelper.accessor('reconstruction_method', {
        header: () => (
          <CellHeader width={TomogramTableWidths.reconstructionMethod}>
            {t('reconstructionMethod')}
          </CellHeader>
        ),
        cell: ({ getValue }) => (
          <TableCell width={TomogramTableWidths.reconstructionMethod}>
            <div>{getValue()}</div>
          </TableCell>
        ),
      }),
      columnHelper.accessor('processing', {
        header: () => (
          <CellHeader width={TomogramTableWidths.postProcessing}>
            {t('postProcessing')}
          </CellHeader>
        ),
        cell: ({ getValue }) => (
          <TableCell width={TomogramTableWidths.postProcessing}>
            <div className="capitalize">{getValue()}</div>
          </TableCell>
        ),
      }),
      columnHelper.display({
        id: 'tomogram-actions',
        header: () => <CellHeader width={TomogramTableWidths.actions} />,
        cell: ({ row: { original } }) => (
          <TableCell width={TomogramTableWidths.actions}>
            <div className="flex flex-col gap-sds-xs items-start">
              {original.is_canonical &&
                original.neuroglancer_config != null && (
                  <ViewTomogramButton
                    tomogramId={original.id.toString()}
                    neuroglancerConfig={original.neuroglancer_config}
                    buttonProps={{
                      sdsStyle: 'square',
                      sdsType: 'primary',
                      className: '!text-sds-body-xxs !h-sds-icon-xl',
                      startIcon: (
                        <Icon sdsIcon="table" sdsType="button" sdsSize="xs" />
                      ),
                    }}
                    event={{
                      datasetId: run.dataset.id,
                      organism: run.dataset.organism_name ?? 'None',
                      runId: run.id,
                      tomogramId: original.id,
                      type: 'tomogram',
                    }}
                  />
                )}
              <Button
                sdsType="primary"
                sdsStyle="minimal"
                className="!justify-start !ml-sds-l !text-sds-body-xxs"
                onClick={() => openMetadataDrawer(original)}
                startIcon={
                  <Icon sdsIcon="infoCircle" sdsSize="xs" sdsType="button" />
                }
              >
                <span>{t('info')}</span>
              </Button>
              <Button
                sdsType="primary"
                sdsStyle="minimal"
                className="!justify-start !ml-sds-l !text-sds-body-xxs"
                onClick={openTomogramDownloadModal}
                startIcon={
                  <Icon sdsIcon="download" sdsSize="xs" sdsType="button" />
                }
              >
                {t('download')}
              </Button>
            </div>
          </TableCell>
        ),
      }),
    ] as ColumnDef<Tomogram>[] // https://github.com/TanStack/table/issues/4382
  }, [openMetadataDrawer, openTomogramDownloadModal, t])

  return <PageTable data={tomograms} columns={columns} hoverType="none" />
}
