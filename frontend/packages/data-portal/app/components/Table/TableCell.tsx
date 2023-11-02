import { CellBasic, CellComponent } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { ReactNode } from 'react'

import { useIsLoading } from 'app/hooks/useIsLoading'

export function TableCell({
  children,
  className,
  maxWidth,
  minWidth,
  primaryText,
  renderLoadingSkeleton = () => <Skeleton variant="text" />,
}: {
  children?: ReactNode
  className?: string
  loadingSkeleton?: boolean
  maxWidth?: number
  minWidth?: number
  primaryText?: string
  renderLoadingSkeleton?: (() => ReactNode) | false
}) {
  const { isLoadingDebounced } = useIsLoading()
  const cellProps = {
    className,
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
    return <CellBasic primaryText={primaryText} {...cellProps} />
  }

  return (
    <CellComponent {...cellProps}>
      {renderLoadingSkeleton && isLoadingDebounced
        ? renderLoadingSkeleton()
        : children}
    </CellComponent>
  )
}
