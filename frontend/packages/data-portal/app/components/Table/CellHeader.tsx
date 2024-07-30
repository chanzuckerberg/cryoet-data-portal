import {
  CellHeader as SDSCellHeader,
  CellHeaderProps,
} from '@czi-sds/components'
import { ReactNode } from 'react'

import {
  getTooltipProps,
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
      tooltipProps={getTooltipProps({ arrowPadding, offset })}
      // TODO Remove ts-ignore when types is updated to use ReactNode
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tooltipText={tooltip}
      style={{
        maxWidth: columnWidth?.max,
        minWidth: columnWidth?.min,
        width: columnWidth?.width,
        verticalAlign: 'top',
      }}
      hideSortIcon={!showSort}
    >
      <p className="line-clamp-1">{children}</p>
      {subHeader && (
        <p className="text-sds-body-xxxs leading-sds-body-xxxs font-normal">
          {subHeader}
        </p>
      )}
    </SDSCellHeader>
  )
}
