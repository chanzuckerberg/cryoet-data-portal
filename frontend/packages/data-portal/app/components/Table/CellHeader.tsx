import {
  CellHeader as SDSCellHeader,
  CellHeaderProps,
} from '@czi-sds/components'
import { ReactNode } from 'react'

import {
  Tooltip,
  TooltipArrowPadding,
  TooltipOffset,
} from 'app/components/Tooltip'
import { TableColumnWidth } from 'app/constants/table'

export function CellHeader({
  arrowPadding,
  offset,
  showSort = false,
  tooltip,
  width: columnWidth,
  children,
  subHeader,
  ...props
}: Omit<
  CellHeaderProps,
  | 'children'
  | 'hideSortIcon'
  | 'shouldShowTooltipOnHover'
  | 'tooltipSubtitle'
  | 'tooltipText'
  | 'width'
  | 'ref'
> & {
  arrowPadding?: TooltipArrowPadding
  children?: ReactNode
  offset?: TooltipOffset
  showSort?: boolean
  subHeader?: string
  tooltip?: ReactNode
  width?: TableColumnWidth
}) {
  return (
    <SDSCellHeader
      {...props}
      shouldShowTooltipOnHover={!!tooltip}
      style={{
        maxWidth: columnWidth?.max,
        minWidth: columnWidth?.min,
        width: columnWidth?.width,
        verticalAlign: 'top',
      }}
      hideSortIcon={!showSort}
      className={
        !tooltip ? 'hover:!text-sds-color-semantic-text-base-secondary' : ''
      }
    >
      <div className="line-clamp-1">
        <Tooltip
          className="inline"
          tooltip={tooltip}
          arrowPadding={arrowPadding}
          offset={offset}
          placement="top"
        >
          {children}
        </Tooltip>
      </div>

      {subHeader && (
        <p className="text-sds-body-xxxs leading-sds-body-xxxs font-normal">
          {subHeader}
        </p>
      )}
    </SDSCellHeader>
  )
}
