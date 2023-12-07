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

export interface TooltipProps {
  arrowPadding?: TooltipArrowPadding
  children: ReactNode
  tooltip: ReactNode
  offset?: TooltipOffset
}

export function getTooltipProps({
  arrowPadding,
  offset,
}: Pick<TooltipProps, 'arrowPadding' | 'offset'> = {}) {
  return {
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
  children,
  tooltip,
  arrowPadding,
  offset,
}: TooltipProps) {
  return (
    <SDSTooltip
      arrow
      title={tooltip}
      {...getTooltipProps({ arrowPadding, offset })}
    >
      <>{children}</>
    </SDSTooltip>
  )
}
