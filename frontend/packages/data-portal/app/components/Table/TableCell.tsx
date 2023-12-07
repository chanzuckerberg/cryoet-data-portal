import { CellBasic, CellComponent } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { ReactNode } from 'react'
import { match } from 'ts-pattern'

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
}: {
  children?: ReactNode
  className?: string
  horizontalAlign?: 'left' | 'center' | 'right'
  loadingSkeleton?: boolean
  maxWidth?: number
  minWidth?: number
  primaryText?: string
  renderLoadingSkeleton?: (() => ReactNode) | false
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
        tooltipProps={{
          classes: {
            arrow: '!text-white',
            tooltip: '!bg-white !text-black',
          },
        }}
        primaryText={primaryText}
        {...cellProps}
      />
    )
  }

  return (
    <CellComponent {...cellProps}>
      {renderLoadingSkeleton && isLoadingDebounced
        ? renderLoadingSkeleton()
        : children}
    </CellComponent>
  )
}
