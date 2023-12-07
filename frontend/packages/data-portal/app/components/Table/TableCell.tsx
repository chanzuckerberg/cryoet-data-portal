import { CellBasic, CellComponent, TooltipProps } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { ReactNode } from 'react'
import { match } from 'ts-pattern'

import { Tooltip } from 'app/components/Tooltip'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { cns } from 'app/utils/cns'

export function TableCell({
  children,
  className,
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
      width: maxWidth,
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
        tooltipProps={tooltipProps}
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

  return <CellComponent {...cellProps}>{content}</CellComponent>
}
