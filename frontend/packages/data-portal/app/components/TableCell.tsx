import { CellBasic, CellComponent } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { ReactNode } from 'react'

import { useIsLoading } from 'app/hooks/useIsLoading'

export function TableCell({
  children,
  className,
  loadingSkeleton = true,
  primaryText,
  renderLoadingSkeleton = () => <Skeleton variant="text" />,
}: {
  children?: ReactNode
  className?: string
  loadingSkeleton?: boolean
  primaryText?: string
  renderLoadingSkeleton?(): ReactNode
}) {
  const isLoading = useIsLoading()

  if (loadingSkeleton && isLoading) {
    return (
      <CellComponent className={className}>
        {renderLoadingSkeleton()}
      </CellComponent>
    )
  }

  if (primaryText) {
    return <CellBasic className={className} primaryText={primaryText} />
  }

  return (
    <CellComponent className={className}>
      {loadingSkeleton && isLoading ? renderLoadingSkeleton() : children}
    </CellComponent>
  )
}
