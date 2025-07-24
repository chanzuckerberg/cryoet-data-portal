import { Icon } from '@czi-sds/components'

import { cns } from 'app/utils/cns'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void

  // Optional props for rich pagination (with item count display)
  startIndex?: number
  endIndex?: number
  totalItems?: number
  itemLabel?: string
  itemsLabel?: string

  // Optional props for simple pagination
  disabled?: boolean
  className?: string
  onClick?: (e: React.MouseEvent) => void
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
  disabled = false,
  className = '',
  onClick,
}: PaginationControlsProps) {
  const isPrevDisabled = disabled || currentPage === 1 || totalPages <= 1
  const isNextDisabled =
    disabled || currentPage >= totalPages || totalPages <= 1

  // Determine if we should show rich pagination (with item count)
  const showItemCount =
    startIndex !== undefined &&
    endIndex !== undefined &&
    totalItems !== undefined &&
    itemLabel !== undefined &&
    itemsLabel !== undefined

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(e)
    if (!isPrevDisabled && currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(e)
    if (!isNextDisabled && currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  if (showItemCount) {
    // Rich pagination with item count display
    return (
      <div className={`flex items-center gap-sds-s ${className}`}>
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
            onClick={handlePrevClick}
            disabled={isPrevDisabled}
            className="px-sds-xxs hover:!bg-light-sds-color-primitive-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <Icon
              sdsIcon="ChevronLeft"
              sdsSize="xs"
              className="!text-light-sds-color-semantic-base-background-primary-inverse"
            />
          </button>
          <button
            type="button"
            onClick={handleNextClick}
            disabled={isNextDisabled}
            className="px-sds-xxs hover:!bg-light-sds-color-primitive-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
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

  // Simple pagination with just buttons
  return (
    <div className={`flex items-center gap-sds-xxs ${className}`}>
      <button
        type="button"
        onClick={handlePrevClick}
        disabled={isPrevDisabled}
        className="p-sds-xs hover:!bg-light-sds-color-primitive-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <Icon
          sdsIcon="ChevronLeft"
          sdsSize="xs"
          className="!text-light-sds-color-semantic-base-background-primary-inverse"
        />
      </button>
      <button
        type="button"
        onClick={handleNextClick}
        disabled={isNextDisabled}
        className="p-sds-xs hover:!bg-light-sds-color-primitive-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <Icon
          sdsIcon="ChevronRight"
          sdsSize="xs"
          className="!text-light-sds-color-semantic-base-background-primary-inverse"
        />
      </button>
    </div>
  )
}
