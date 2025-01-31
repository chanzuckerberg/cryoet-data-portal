import { CellComponent } from '@czi-sds/components'
import Skeleton from '@mui/material/Skeleton'
import { ReactNode } from 'react'
import { match } from 'ts-pattern'

import { Tooltip, TooltipProps } from 'app/components/Tooltip'
import { TableColumnWidth } from 'app/constants/table'
import { useIsLoading } from 'app/hooks/useIsLoading'
import { cns } from 'app/utils/cns'

export function TableCell({
  children,
  className,
  horizontalAlign,
  primaryText,
  renderLoadingSkeleton = () => <Skeleton variant="text" />,
  tooltip,
  tooltipProps,
  width,
}: {
  children?: ReactNode
  className?: string
  horizontalAlign?: 'left' | 'center' | 'right'
  loadingSkeleton?: boolean
  primaryText?: string
  renderLoadingSkeleton?: (() => ReactNode) | false
  tooltip?: ReactNode
  tooltipProps?: Partial<TooltipProps>
  width?: TableColumnWidth
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
      maxWidth: width?.max,
      minWidth: width?.min,
      width: width?.width,
    },
  }

  if (renderLoadingSkeleton && isLoadingDebounced) {
    return (
      <CellComponent {...cellProps}>{renderLoadingSkeleton()}</CellComponent>
    )
  }

  if (primaryText) {
    return (
      <td
        className={cns('align-top px-3 py-4', cellProps.className)}
        style={cellProps.style}
      >
        <div className="text-sds-body-s leading-sds-body-s font-normal">
          <Tooltip
            className="inline"
            tooltip={primaryText}
            placement="top"
            {...tooltipProps}
          >
            {primaryText}
          </Tooltip>
        </div>
      </td>
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
      <Tooltip className="inline" tooltip={tooltip} {...tooltipProps}>
        {content}
      </Tooltip>
    )
  }

  return <CellComponent {...cellProps}>{content}</CellComponent>
}
