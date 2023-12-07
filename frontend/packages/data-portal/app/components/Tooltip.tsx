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
}

export function getTooltipProps({
  arrowPadding,
  offset,
}: Pick<TooltipProps, 'arrowPadding' | 'offset'> = {}) {
  return {
    arrow: true,
    leaveDelay: 0,

    classes: {
      arrow: '!text-white',

      tooltip: cnsNoMerge(
        '!px-sds-l !py-2',
        '!bg-white !text-black !font-normal',
        '!text-left !text-sds-body-xs !leading-sds-body-xs',
        'shadow-lg',
      ),
    },

    PopperOptions: {
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
  ...props
}: TooltipProps) {
  return (
    <SDSTooltip
      title={tooltip}
      {...getTooltipProps({ arrowPadding, offset })}
      {...props}
    >
      <div className={className}>{children}</div>
    </SDSTooltip>
  )
}
