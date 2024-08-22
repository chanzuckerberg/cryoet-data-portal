import { InputText } from '@czi-sds/components'

import styles from './Filters.module.css'

export function InputFilter({
  id,
  label,
  onChange,
  value,
  hideLabel,
  className,
  error,
}: {
  id: string
  label: string
  onChange(value: string): void
  value: string
  hideLabel?: boolean
  className?: string
  error?: boolean
}) {
  return (
    // apply style override here since it has higher specificity and MUI is weird
    <div className={styles.inputText}>
      <InputText
        id={id}
        label={label}
        onChange={(event) => onChange(event.target.value)}
        value={value}
        fullWidth
        hideLabel={hideLabel}
        className={className}
        intent={error ? 'error' : undefined}
      />
    </div>
  )
}
