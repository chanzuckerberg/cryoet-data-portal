import { CellBasic, CellComponent, Tooltip } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { ReactNode } from 'react'
import { match } from 'ts-pattern'

import { TOOLTIP_CLASSES } from 'app/constants/tooltip'
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
        tooltipProps={TOOLTIP_CLASSES}
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
      <Tooltip arrow classes={TOOLTIP_CLASSES.classes} title={tooltip}>
        <div>{content}</div>
      </Tooltip>
    )
  }

  return <CellComponent {...cellProps}>{content}</CellComponent>
}
