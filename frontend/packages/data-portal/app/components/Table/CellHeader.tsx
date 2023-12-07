import {
  CellHeader as SDSCellHeader,
  CellHeaderProps,
} from '@czi-sds/components'
import { ReactNode } from 'react'

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
      tooltipProps={{
        classes: {
          arrow: '!text-white',
          tooltip: '!bg-white !text-black',
        },
      }}
      // TODO Remove ts-ignore when types is updated to use ReactNode
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tooltipText={tooltip}
    />
  )
}
