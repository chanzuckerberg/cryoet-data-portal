import { Icon } from '@czi-sds/components'
import { MouseEvent, ReactNode } from 'react'

import { cns } from 'app/utils/cns'
import { formatNumber } from 'app/utils/string'

import { Link } from './Link'
import { PaginationControls } from './PaginationControls'

/**
 * Header component for grouped data sections that displays a title, optional external link,
 * and contextual information. Shows item counts and additional metadata when collapsed,
 * and pagination controls when expanded. Used as the header element in accordion components
 * like GroupedAccordion to provide a consistent interface for expandable data groups.
 */
export interface GroupedDataHeaderProps {
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
  className?: string
}

export function GroupedDataHeader({
  title,
  isExpanded,
  itemCount,
  itemLabel,
  itemsLabel,
  additionalInfo,
  showPagination = false,
  paginationProps,
  externalLink,
  className = '',
}: GroupedDataHeaderProps): ReactNode {
  const handleExternalLinkClick = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      className={cns(
        'flex items-center justify-between w-full gap-sds-xl',
        className,
      )}
    >
      <div className="flex items-center gap-sds-xs">
        <span className="text-sds-header-m-600-wide tracking-sds-header-m-600-wide font-semibold">
          {title}
        </span>

        {externalLink && (
          <Link to={externalLink} onClick={handleExternalLinkClick} newTab>
            <Icon
              sdsIcon="Open"
              sdsSize="xs"
              className="!text-light-sds-color-semantic-base-ornament-secondary"
            />
          </Link>
        )}
      </div>

      {!isExpanded && itemCount !== undefined && itemLabel ? (
        <span className="font-normal text-sds-body-xxs-400-wide tracking-sds-body-xxs-400-wide whitespace-nowrap">
          {formatNumber(itemCount)} {itemLabel}
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
