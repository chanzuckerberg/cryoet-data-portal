import { CellBasic, CellComponent } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { ReactNode } from 'react'

import { useIsLoading } from 'app/hooks/useIsLoading'

export function TableCell({
  children,
  className,
  loadingSkeleton = true,
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
  renderLoadingSkeleton?(): ReactNode
}) {
  const { isLoadingDebounced } = useIsLoading()
  const cellProps = {
    className,
    style: {
      maxWidth,
      minWidth,
    },
  }

  if (loadingSkeleton && isLoadingDebounced) {
    return (
      <CellComponent {...cellProps}>{renderLoadingSkeleton()}</CellComponent>
    )
  }

  if (primaryText) {
    return <CellBasic primaryText={primaryText} {...cellProps} />
  }

  return (
    <CellComponent {...cellProps}>
      {loadingSkeleton && isLoadingDebounced
        ? renderLoadingSkeleton()
        : children}
    </CellComponent>
  )
}
