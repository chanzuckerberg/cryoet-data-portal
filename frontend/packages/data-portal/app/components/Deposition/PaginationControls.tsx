import { Icon } from '@czi-sds/components'

import { cns } from 'app/utils/cns'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  startIndex: number
  endIndex: number
  totalItems: number
  itemLabel: string
  itemsLabel: string
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
  itemLabel,
  itemsLabel,
}: PaginationControlsProps) {
  const handlePreviousPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextPage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="flex items-center gap-sds-s">
      <span
        className={cns(
          'text-sds-body-xxxs-400-wide tracking-sds-body-xxxs-400-wide',
          'text-light-sds-color-semantic-base-text-secondary',
        )}
      >
        {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}{' '}
        {totalItems === 1 ? itemLabel : itemsLabel}
      </span>
      <div className="flex items-center gap-sds-xxs">
        <button
          type="button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || totalPages <= 1}
          className="px-sds-xxs hover:!bg-light-sds-color-primitive-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            sdsIcon="ChevronLeft"
            sdsSize="xs"
            className="!text-light-sds-color-semantic-base-background-primary-inverse"
          />
        </button>
        <button
          type="button"
          onClick={handleNextPage}
          disabled={currentPage >= totalPages || totalPages <= 1}
          className="px-sds-xxs hover:!bg-light-sds-color-primitive-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            sdsIcon="ChevronRight"
            sdsSize="xs"
            className="!text-light-sds-color-semantic-base-background-primary-inverse"
          />
        </button>
      </div>
    </div>
  )
}
