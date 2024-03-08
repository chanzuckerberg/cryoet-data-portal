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
      }}
      hideSortIcon={!showSort}
    />
  )
}
