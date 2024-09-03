import {
  Tooltip as SDSTooltip,
  TooltipProps as SDSTooltipProps,
} from '@czi-sds/components'
import { ReactNode } from 'react'

import { cnsNoMerge } from 'app/utils/cns'

export type TooltipOffset = [number, number]

export interface TooltipArrowPadding {
  bottom?: number
  left?: number
  right?: number
  top?: number
}

export interface TooltipProps
  extends Omit<
    SDSTooltipProps,
    'children' | 'PopperOptions' | 'title' | 'arrow'
  > {
  arrowPadding?: TooltipArrowPadding
  children: ReactNode
  className?: string
  offset?: TooltipOffset
  tooltip: ReactNode
  center?: boolean
  size?: 's' | 'm'
}

export function getTooltipProps({
  arrowPadding,
  offset,
  sdsStyle,
  center,
  size = 'm',
}: Pick<
  TooltipProps,
  'arrowPadding' | 'offset' | 'sdsStyle' | 'center' | 'size'
> = {}) {
  return {
    arrow: true,
    leaveDelay: 0,

    classes: {
      arrow: sdsStyle === 'dark' ? '!text-black' : '!text-white',

      tooltip: cnsNoMerge(
        '!px-sds-l !py-2',
        sdsStyle === 'dark' ? '!bg-black !text-white' : '!bg-white !text-black',
        center ? '!text-center' : '!text-left',
        '!font-normal !text-sds-body-xs !leading-sds-body-xs',
        'shadow-lg',
        size === 's' && 'w-[200px]',
      ),
    },

    PopperProps: {
      popperOptions: {
        modifiers: [
          ...(offset
            ? [
                {
                  name: 'offset',
                  options: { offset },
                },
              ]
            : []),

          ...(arrowPadding
            ? [
                {
                  name: 'arrow',
                  options: {
                    padding: arrowPadding,
                  },
                },
              ]
            : []),
        ],
      },
    },
  } as Partial<SDSTooltipProps>
}

export function Tooltip({
  arrowPadding,
  children,
  className,
  offset,
  tooltip,
  sdsStyle,
  center,
  size,
  ...props
}: TooltipProps) {
  return (
    <SDSTooltip
      title={tooltip}
      {...getTooltipProps({ arrowPadding, offset, sdsStyle, center, size })}
      {...props}
    >
      <div className={className}>{children}</div>
    </SDSTooltip>
  )
}
