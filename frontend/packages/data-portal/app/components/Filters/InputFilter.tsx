import { InputText } from '@czi-sds/components'

import styles from './Filters.module.css'

export interface InputFilterProps {
  id: string
  label: string
  value: string
  onChange(value: string): void
  hideLabel?: boolean
  className?: string
  error?: boolean
}

export function InputFilter({
  id,
  label,
  onChange,
  value,
  hideLabel,
  className,
  error,
}: InputFilterProps) {
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
