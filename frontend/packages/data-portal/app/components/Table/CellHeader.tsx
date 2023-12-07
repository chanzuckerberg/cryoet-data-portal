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

export function CellHeader({
  arrowPadding,
  offset,
  tooltip,
  ...props
}: Omit<
  CellHeaderProps,
  'shouldShowTooltipOnHover' | 'tooltipText' | 'tooltipSubtitle'
> & {
  arrowPadding?: TooltipArrowPadding
  offset?: TooltipOffset
  tooltip?: ReactNode
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
    />
  )
}
