import { cns } from 'app/utils/cns'

export const EXPANDABLE_ROW_CLASSES = cns(
  'cursor-pointer',
  '!bg-light-sds-color-primitive-gray-75',
  'border-none',
)

export const CHEVRON_ICON_CLASSES =
  '!text-light-sds-color-semantic-base-ornament-secondary'

export const RUN_LABEL_CLASSES =
  'text-sds-body-xxs-600-wide tracking-sds-body-xxs-600-wide font-semibold'

export const COUNT_DISPLAY_CLASSES = cns(
  'text-[11px] tracking-sds-body-xxxs-400-wide',
  'text-light-sds-color-semantic-base-text-secondary',
)

export const SKELETON_ROW_CLASSES = cns(
  '!bg-light-sds-color-semantic-base-background-secondary',
  'last:border-none',
)
