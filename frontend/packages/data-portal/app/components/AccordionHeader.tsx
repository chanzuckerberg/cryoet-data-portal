import { Icon } from '@czi-sds/components'
import { MouseEvent, ReactNode } from 'react'

import { cns } from 'app/utils/cns'

import { Link } from './Link'
import { PaginationControls } from './PaginationControls'

export interface AccordionHeaderProps {
  title: string
  isExpanded: boolean
  itemCount?: number
  itemLabel?: string
  itemsLabel?: string
  additionalInfo?: string
  showPagination?: boolean
  paginationProps?: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    startIndex?: number
    endIndex?: number
    totalItems?: number
  }
  externalLink?: string
  onExternalLinkClick?: (e: MouseEvent) => void
  className?: string
}

export function AccordionHeader({
  title,
  isExpanded,
  itemCount,
  itemLabel,
  itemsLabel,
  additionalInfo,
  showPagination = false,
  paginationProps,
  externalLink,
  onExternalLinkClick,
  className = '',
}: AccordionHeaderProps): ReactNode {
  const handleExternalLinkClick = (e: MouseEvent) => {
    e.stopPropagation()
    onExternalLinkClick?.(e)
  }

  return (
    <div className={cns('flex items-center justify-between w-full', className)}>
      <div className="flex items-center gap-sds-xs">
        <Icon
          sdsIcon="ChevronDown"
          sdsSize="xs"
          className={cns(
            'transition-transform !text-light-sds-color-semantic-base-background-primary-inverse',
            isExpanded ? 'rotate-180' : '',
          )}
        />
        <span className="text-sds-header-m-600-wide tracking-sds-header-m-600-wide font-semibold">
          {title}
        </span>
        {externalLink && (
          <Link to={externalLink} onClick={handleExternalLinkClick}>
            <Icon
              sdsIcon="Open"
              sdsSize="xs"
              className="!text-light-sds-color-semantic-base-ornament-secondary"
            />
          </Link>
        )}
      </div>

      {!isExpanded && itemCount !== undefined && itemLabel ? (
        <span className="font-normal text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide">
          {itemCount} {itemLabel}
          {additionalInfo && ` | ${additionalInfo}`}
        </span>
      ) : null}

      {isExpanded && showPagination && paginationProps ? (
        <PaginationControls
          currentPage={paginationProps.currentPage}
          totalPages={paginationProps.totalPages}
          onPageChange={paginationProps.onPageChange}
          startIndex={paginationProps.startIndex}
          endIndex={paginationProps.endIndex}
          totalItems={paginationProps.totalItems}
          itemLabel={itemLabel}
          itemsLabel={itemsLabel}
        />
      ) : null}
    </div>
  )
}
