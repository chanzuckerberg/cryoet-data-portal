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

import { ErrorBoundary } from '../ErrorBoundary'

export function CellHeader({
  arrowPadding,
  errorLogId,
  offset,
  tooltip,
  ...props
}: Omit<
  CellHeaderProps,
  'shouldShowTooltipOnHover' | 'tooltipText' | 'tooltipSubtitle'
> & {
  arrowPadding?: TooltipArrowPadding
  errorLogId?: string
  offset?: TooltipOffset
  tooltip?: ReactNode
}) {
  return (
    <ErrorBoundary logId={errorLogId}>
      <SDSCellHeader
        {...props}
        shouldShowTooltipOnHover={!!tooltip}
        tooltipProps={getTooltipProps({ arrowPadding, offset })}
        // TODO Remove ts-ignore when types is updated to use ReactNode
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tooltipText={tooltip}
      />
    </ErrorBoundary>
  )
}
