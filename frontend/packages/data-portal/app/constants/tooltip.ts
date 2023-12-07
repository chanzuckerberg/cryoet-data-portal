import { TooltipProps } from '@czi-sds/components'

import { cnsNoMerge } from 'app/utils/cns'

export const TOOLTIP_CLASSES: Pick<TooltipProps, 'classes'> = {
  classes: {
    arrow: '!text-white',
    tooltip: cnsNoMerge(
      '!px-sds-l !py-2',
      '!bg-white !text-black !font-normal',
      '!text-left !text-sds-body-xs !leading-sds-body-xs',
      'shadow-lg',
    ),
  },
}
