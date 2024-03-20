import { InputText } from '@czi-sds/components'

export function InputFilter({
  id,
  label,
  onChange,
  value,
  hideLabel,
}: {
  id: string
  label: string
  onChange(value: string): void
  value: string
  hideLabel?: boolean
}) {
  return (
    <div>
      <InputText
        id={id}
        label={label}
        onChange={(event) => onChange(event.target.value)}
        value={value}
        fullWidth
        hideLabel={hideLabel}
      />
    </div>
  )
}
