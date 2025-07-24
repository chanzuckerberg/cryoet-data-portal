import { Icon } from '@czi-sds/components'

import { useI18n } from 'app/hooks/useI18n'
import { cns } from 'app/utils/cns'

// Constants for styling consistency
const BUTTON_BASE_CLASSES =
  'hover:!bg-light-sds-color-primitive-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed'
const ICON_SIZE = 'xs' as const
const ICON_DISABLED_COLOR =
  '!text-light-sds-color-semantic-base-ornament-disabled'
const ICON_ENABLED_COLOR =
  '!text-light-sds-color-semantic-base-ornament-secondary'

// Reusable pagination button component
function PaginationButton({
  direction,
  isDisabled,
  onClick: onClickHandler,
}: {
  direction: 'prev' | 'next'
  isDisabled: boolean
  onClick: (e: React.MouseEvent) => void
}) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={onClickHandler}
      disabled={isDisabled}
      className={cns('px-sds-xxs', BUTTON_BASE_CLASSES)}
      aria-label={
        direction === 'prev'
          ? t('paginationPreviousPage')
          : t('paginationNextPage')
      }
    >
      <Icon
        sdsIcon={direction === 'prev' ? 'ChevronLeft' : 'ChevronRight'}
        sdsSize={ICON_SIZE}
        className={cns(isDisabled ? ICON_DISABLED_COLOR : ICON_ENABLED_COLOR)}
      />
    </button>
  )
}

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

  // Reusable button pair
  const buttonPair = (
    <>
      <PaginationButton
        direction="prev"
        isDisabled={isPrevDisabled}
        onClick={handlePrevClick}
      />

      <PaginationButton
        direction="next"
        isDisabled={isNextDisabled}
        onClick={handleNextClick}
      />
    </>
  )

  if (showItemCount) {
    // Rich pagination with item count display
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
        <div className="flex items-center gap-sds-xxs">{buttonPair}</div>
      </div>
    )
  }

  // Simple pagination with just buttons
  return <div className="flex items-center gap-sds-xxs">{buttonPair}</div>
}
