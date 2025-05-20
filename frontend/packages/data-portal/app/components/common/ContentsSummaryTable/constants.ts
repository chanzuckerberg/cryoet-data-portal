import { cnsNoMerge } from 'app/utils/cns'
// use clsx here instead of cns since it erroneously merges text-light-sds-color-primitive-gray-500 and text-sds-caps-xxxs-600-wide
export const sectionHeaderStyles = cnsNoMerge(
  'font-semibold uppercase',
  'text-light-sds-color-primitive-gray-900 ',
  'text-sds-caps-xxxs-600-wide leading-sds-caps-xxxs tracking-sds-caps-xxxs-600-wide',
  'mb-sds-xs',
)
