import { CellBasic, CellComponent } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { ReactNode } from 'react'
import { match } from 'ts-pattern'

import { ErrorBoundary } from 'app/components/ErrorBoundary'
import { getTooltipProps, Tooltip, TooltipProps } from 'app/components/Tooltip'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { cns } from 'app/utils/cns'

export function TableCell({
  children,
  className,
  errorLogId,
  horizontalAlign,
  maxWidth,
  minWidth,
  primaryText,
  renderLoadingSkeleton = () => <Skeleton variant="text" />,
  tooltip,
  tooltipProps,
}: {
  children?: ReactNode
  className?: string
  errorLogId?: string
  horizontalAlign?: 'left' | 'center' | 'right'
  loadingSkeleton?: boolean
  maxWidth?: number
  minWidth?: number
  primaryText?: string
  renderLoadingSkeleton?: (() => ReactNode) | false
  tooltip?: ReactNode
  tooltipProps?: Partial<TooltipProps>
}) {
  const { isLoadingDebounced } = useIsLoading()
  const cellProps = {
    className: cns(
      match(horizontalAlign)
        .with('left', () => '!text-left')
        .with('center', () => '!text-center')
        .with('right', () => '!text-right')
        .otherwise(() => ''),

      className,
    ),
    style: {
      maxWidth,
      minWidth,
    },
  }

  if (renderLoadingSkeleton && isLoadingDebounced) {
    return (
      <CellComponent {...cellProps}>{renderLoadingSkeleton()}</CellComponent>
    )
  }

  if (primaryText) {
    return (
      <CellBasic
        primaryText={primaryText}
        tooltipProps={getTooltipProps(tooltipProps)}
        {...cellProps}
      />
    )
  }

  let content = (
    <>
      {renderLoadingSkeleton && isLoadingDebounced
        ? renderLoadingSkeleton()
        : children}
    </>
  )

  if (tooltip) {
    content = (
      <Tooltip tooltip={tooltip} {...tooltipProps}>
        <div>{content}</div>
      </Tooltip>
    )
  }

  return (
    <ErrorBoundary logId={errorLogId}>
      <CellComponent {...cellProps}>{content}</CellComponent>
    </ErrorBoundary>
  )
}
