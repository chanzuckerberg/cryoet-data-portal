import {
  CellHeader as SDSCellHeader,
  CellHeaderProps,
} from '@czi-sds/components'
import { ReactNode } from 'react'

import { TOOLTIP_CLASSES } from 'app/constants/tooltip'

export function CellHeader({
  tooltip,
  ...props
}: Omit<
  CellHeaderProps,
  'shouldShowTooltipOnHover' | 'tooltipText' | 'tooltipSubtitle'
> & {
  tooltip?: ReactNode
}) {
  return (
    <SDSCellHeader
      {...props}
      shouldShowTooltipOnHover={!!tooltip}
      tooltipProps={TOOLTIP_CLASSES}
      // TODO Remove ts-ignore when types is updated to use ReactNode
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tooltipText={tooltip}
    />
  )
}
