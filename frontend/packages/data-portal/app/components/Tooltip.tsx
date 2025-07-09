import {
  Tooltip as SDSTooltip,
  TooltipProps as SDSTooltipProps,
} from '@czi-sds/components'
import { ReactNode } from 'react'

import { cns, cnsNoMerge } from 'app/utils/cns'

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
  size?: 's' | 'm' | 'inherit'
}

export function getTooltipProps({
  arrowPadding,
  offset,
  sdsStyle,
  center,
  size = 'm',
  classes,
}: Pick<
  TooltipProps,
  'arrowPadding' | 'offset' | 'sdsStyle' | 'center' | 'size' | 'classes'
> = {}) {
  return {
    arrow: true,
    leaveDelay: 0,

    classes: {
      ...classes,

      arrow: cns(
        sdsStyle === 'dark' ? '!text-black' : '!text-white',
        classes?.arrow,
      ),

      tooltip: cnsNoMerge(
        '!px-sds-l !py-2',
        sdsStyle === 'dark' ? '!bg-black !text-white' : '!bg-white !text-black',
        center ? '!text-center' : '!text-left',
        '!font-normal !text-sds-body-xs-400-wide !leading-sds-body-xs',
        'shadow-lg',
        size === 's' && 'w-[200px]',
        size === 'inherit' && '[&&&]:max-w-none',
        'border-solid border border-light-sds-color-primitive-gray-300 cursor-default',
        classes?.tooltip,
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
  classes,
  ...props
}: TooltipProps) {
  return (
    <SDSTooltip
      title={tooltip}
      {...getTooltipProps({
        arrowPadding,
        offset,
        sdsStyle,
        center,
        size,
        classes,
      })}
      {...props}
    >
      <div className={className}>{children}</div>
    </SDSTooltip>
  )
}
