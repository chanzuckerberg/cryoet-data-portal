import { CellComponent, Icon, TableRow } from '@czi-sds/components'
import { Fragment } from 'react'

import { KeyPhoto } from 'app/components/KeyPhoto'
import { Link } from 'app/components/Link'
import { PaginationControls } from 'app/components/PaginationControls'
import { TableCell } from 'app/components/Table'
import { ViewTomogramButton } from 'app/components/ViewTomogramButton'
import { DepositionTomogramTableWidths } from 'app/constants/table'
import { useI18n } from 'app/hooks/useI18n'
import { TomogramRowData } from 'app/hooks/useTomogramData'
import { cns } from 'app/utils/cns'

import { RunData } from './mockDepositedLocationData'

interface TomogramRowProps {
  run: RunData<TomogramRowData>
  isExpanded: boolean
  onToggle: () => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TomogramRow({
  run,
  isExpanded,
  onToggle,
  currentPage,
  totalPages,
  onPageChange,
}: TomogramRowProps) {
  const { t } = useI18n()
  const tomogramCount = run.items.length
  const pageSize = 5
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  return (
    <Fragment key={run.runName}>
      {/* Run row */}
      <TableRow
        className={cns(
          'cursor-pointer',
          '!bg-light-sds-color-semantic-base-background-secondary hover:!bg-light-sds-color-semantic-base-fill-hover',
          'border border-light-sds-color-semantic-base-border-secondary',
        )}
        onClick={onToggle}
      >
        <CellComponent colSpan={7} className="!p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-sds-xs">
              <Icon
                sdsIcon={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                sdsSize="xs"
                className="!text-light-sds-color-semantic-base-ornament-secondary"
              />

              <span className="text-sds-body-xxs-600-wide tracking-sds-body-xxs-600-wide font-semibold">
                {t('run')}: {run.runName}
              </span>
            </div>
            <div className="flex justify-end">
              {isExpanded ? (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  totalItems={run.items.length}
                  itemLabel={t('tomogram')}
                  itemsLabel={t('tomograms')}
                />
              ) : (
                <span
                  className={cns(
                    'text-sds-body-xxxs-400-wide tracking-sds-body-xxxs-400-wide',
                    'text-light-sds-color-semantic-base-text-secondary',
                  )}
                >
                  {tomogramCount}{' '}
                  {tomogramCount === 1 ? t('tomogram') : t('tomograms')}
                </span>
              )}
            </div>
          </div>
        </CellComponent>
      </TableRow>

      {/* Expanded tomogram rows */}
      {isExpanded &&
        (() => {
          const paginatedTomograms = run.items.slice(startIndex, endIndex)

          return (
            <>
              {paginatedTomograms.map((tomogram) => (
                <TableRow
                  key={`${run.runName}-${tomogram.id}`}
                  className="border-b border-light-sds-color-semantic-base-divider"
                >
                  <TableCell width={DepositionTomogramTableWidths.photo}>
                    <div className="pl-sds-xl">
                      <KeyPhoto
                        className="w-[100px] min-w-[100px] aspect-[4/3]"
                        src={tomogram.keyPhotoUrl}
                        title={tomogram.name}
                      />
                    </div>
                  </TableCell>
                  <TableCell width={DepositionTomogramTableWidths.name}>
                    <Link
                      to={`/tomograms/${tomogram.id}`}
                      className="text-sds-body-s-400-wide text-light-sds-color-semantic-base-link hover:text-light-sds-color-semantic-base-link"
                    >
                      {tomogram.name}
                    </Link>
                  </TableCell>
                  <TableCell width={DepositionTomogramTableWidths.voxelSpacing}>
                    <span className="text-sds-body-s-400-wide">
                      {tomogram.voxelSpacing} Å
                    </span>
                  </TableCell>
                  <TableCell
                    width={DepositionTomogramTableWidths.reconstructionMethod}
                  >
                    <span className="text-sds-body-s-400-wide">
                      {tomogram.reconstructionMethod}
                    </span>
                  </TableCell>
                  <TableCell
                    width={DepositionTomogramTableWidths.postProcessing}
                  >
                    <span className="text-sds-body-s-400-wide">
                      {tomogram.processing}
                    </span>
                  </TableCell>
                  <TableCell width={DepositionTomogramTableWidths.depositedIn}>
                    <span className="text-sds-body-s-400-wide">
                      {tomogram.depositedIn}
                    </span>
                  </TableCell>
                  <TableCell width={{ width: 160 }}>
                    <ViewTomogramButton
                      tomogramId={tomogram.id.toString()}
                      neuroglancerConfig={tomogram.neuroglancerConfig}
                      buttonProps={{
                        sdsStyle: 'square',
                        sdsType: 'secondary',
                      }}
                      event={{
                        tomogramId: tomogram.id,
                        datasetId: 0,
                        runId: 0,
                        organism: '',
                        type: 'tomogram',
                      }}
                      tooltipPlacement="top"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )
        })()}
    </Fragment>
  )
}
