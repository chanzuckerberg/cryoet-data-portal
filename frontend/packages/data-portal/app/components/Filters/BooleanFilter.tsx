import { InputCheckbox } from '@czi-sds/components'

import { cns } from 'app/utils/cns'

import styles from './Filters.module.css'

export function BooleanFilter({
  caption,
  label,
  onChange,
  value,
  wrapped,
}: {
  caption?: string
  label: string
  onChange(value: boolean): void
  value: boolean
  wrapped?: boolean
}) {
  return (
    <div
      className={cns(
        'pt-sds-m pl-sds-s pb-sds-s',
        styles.boolean,
        !wrapped && 'whitespace-nowrap',
        wrapped && 'max-w-[185px]',
        wrapped && styles.booleanWrapped,
      )}
    >
      <InputCheckbox
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
        label={label}
        caption={caption}
      />
    </div>
  )
}
