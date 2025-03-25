import { InputCheckbox } from '@czi-sds/components'

import { cns } from 'app/utils/cns'

import styles from './Filters.module.css'

export function BooleanFilter({
  caption,
  label,
  onChange,
  value,
}: {
  caption?: string
  label: string
  onChange(value: boolean): void
  value: boolean
}) {
  return (
    <div
      className={cns(
        'pt-sds-m pl-sds-s pb-sds-s max-w-[190px]',
        styles.boolean,
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
