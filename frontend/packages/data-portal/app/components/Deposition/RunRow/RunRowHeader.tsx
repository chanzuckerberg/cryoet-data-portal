import { CellComponent, Icon, TableRow } from '@czi-sds/components'

import { PaginationControls } from 'app/components/PaginationControls'
import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

import { RunRowHeaderProps } from './types'

export function RunRowHeader({
  runName,
  isExpanded,
  onToggle,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
}: RunRowHeaderProps) {
  const { t } = useI18n()

  return (
    <TableRow
      className={cns(
        'cursor-pointer',
        '!bg-light-sds-color-semantic-base-background-secondary hover:!bg-light-sds-color-semantic-base-fill-hover',
        'border-none',
        // 'border border-light-sds-color-semantic-base-border-secondary',
      )}
      onClick={onToggle}
    >
      <CellComponent colSpan={3} className="!p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sds-xs">
            <Icon
              sdsIcon={isExpanded ? 'ChevronUp' : 'ChevronDown'}
              sdsSize="xs"
              className="!text-light-sds-color-semantic-base-ornament-secondary"
            />

            <span className="text-sds-body-xxs-600-wide tracking-sds-body-xxs-600-wide font-semibold">
              {t('run')}: {runName}
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
                totalItems={totalCount}
                itemLabel={t('annotation')}
                itemsLabel={t('annotations')}
                variant="secondary"
              />
            ) : (
              <span
                className={cns(
                  'text-sds-body-xxxs-400-wide tracking-sds-body-xxxs-400-wide',
                  'text-light-sds-color-semantic-base-text-secondary',
                )}
              >
                {totalCount}{' '}
                {totalCount === 1 ? t('annotation') : t('annotations')}
              </span>
            )}
          </div>
        </div>
      </CellComponent>
    </TableRow>
  )
}
