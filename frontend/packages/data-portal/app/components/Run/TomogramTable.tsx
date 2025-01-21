/* eslint-disable react/no-unstable-nested-components */

import { Button, Icon } from '@czi-sds/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'

import { CellHeader, PageTable, TableCell } from 'app/components/Table'
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
import { getTomogramName } from 'app/utils/tomograms'

import { AuthorList } from '../AuthorList'
import { I18n } from '../I18n'
import { KeyPhoto } from '../KeyPhoto'
import { TomogramTypeBadge } from '../TomogramTypeBadge'
import { Tooltip } from '../Tooltip'
import { ViewTomogramButton } from '../ViewTomogramButton'

export function TomogramsTable() {
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

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<TomogramV2>()
    return [
      columnHelper.accessor('keyPhotoUrl', {
        header: () => <CellHeader width={TomogramTableWidths.photo} />,
        cell: ({ row: { original } }) => (
          <TableCell width={TomogramTableWidths.photo}>
            <KeyPhoto
              className="max-w-[134px]"
              title={original.name ?? ''}
              src={original.keyPhotoUrl ?? undefined}
            />
          </TableCell>
        ),
      }),
      columnHelper.accessor('id', {
        header: () => (
          <CellHeader width={TomogramTableWidths.name}>
            {t('tomogramName')}
          </CellHeader>
        ),
        cell: ({ row: { original } }) => (
          <TableCell
            className="flex flex-col !items-start"
            width={TomogramTableWidths.name}
          >
            <div className="text-sds-body-m leading-sds-body-m font-semibold text-ellipsis line-clamp-1 break-all">
              {getTomogramName(original)}
            </div>

            <div className="flex items-center flex-wrap gap-sds-xs text-sds-body-xxs mt-sds-xxxs">
              {`${t('tomogramId')}: ${IdPrefix.Tomogram}-${original.id}`}

              {original.isPortalStandard && (
                <TomogramTypeBadge type="standard" showTooltip />
              )}

              {original.isAuthorSubmitted && (
                <TomogramTypeBadge type="author" showTooltip />
              )}
            </div>

            <div className=" text-sds-color-semantic-text-base-secondary text-sds-body-xxs leading-sds-header-xxs mt-2">
              <AuthorList
                authors={original.authors.edges.map((edge) => edge.node)}
                compact
              />
            </div>
          </TableCell>
        ),
      }),
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
            <div>{getValue()}</div>
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
              <Tooltip tooltip={<I18n i18nKey="alignmentIdCanonicalTooltip" />}>
                <p
                  className={cnsNoMerge(
                    'text-sds-body-xxs leading-sds-body-xxs text-sds-color-semantic-text-base-secondary',
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
      columnHelper.accessor('voxelSpacing', {
        header: () => (
          <CellHeader width={TomogramTableWidths.voxelSpacing}>
            {t('voxelSpacing')}
          </CellHeader>
        ),
        cell: ({ getValue, row: { original } }) => (
          <TableCell width={TomogramTableWidths.voxelSpacing}>
            {t('unitAngstrom', { value: getValue() })}
            <div className="text-sds-body-xxs leading-sds-body-xxs text-sds-color-semantic-text-base-secondary">
              ({original.sizeX}, {original.sizeY}, {original.sizeZ})px
            </div>
          </TableCell>
        ),
      }),
      columnHelper.accessor('reconstructionMethod', {
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
              {/* TODO use `isVisualizationDefault` when data is ready */}
              {original.isAuthorSubmitted && (
                <ViewTomogramButton
                  tomogramId={original.id.toString()}
                  neuroglancerConfig={original.neuroglancerConfig}
                  buttonProps={{
                    sdsStyle: 'square',
                    sdsType: 'primary',
                    className: '!text-sds-body-xxs !h-sds-icon-xl',
                    startIcon: (
                      <Icon sdsIcon="Cube" sdsType="button" sdsSize="xs" />
                    ),
                  }}
                  tooltipPlacement="top"
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
                className="!justify-start !ml-sds-m !text-sds-body-xxs"
                onClick={() => openMetadataDrawer(original)}
                startIcon={
                  <Icon sdsIcon="InfoCircle" sdsSize="xs" sdsType="button" />
                }
              >
                <span>{t('info')}</span>
              </Button>
              <Button
                sdsType="primary"
                sdsStyle="minimal"
                className="!justify-start !ml-sds-m !text-sds-body-xxs"
                onClick={() => {
                  openTomogramDownloadModal({
                    tomogramId: original.id,
                    datasetId: run.dataset.id,
                    runId: run.id,
                  })
                }}
                startIcon={
                  <Icon sdsIcon="Download" sdsSize="xs" sdsType="button" />
                }
              >
                {t('download')}
              </Button>
            </div>
          </TableCell>
        ),
      }),
    ] as ColumnDef<TomogramV2>[] // https://github.com/TanStack/table/issues/4382
  }, [
    run.id,
    run.dataset.id,
    run.dataset.organism_name,
    openMetadataDrawer,
    openTomogramDownloadModal,
    t,
  ])

  return <PageTable data={tomograms} columns={columns} hoverType="none" />
}
