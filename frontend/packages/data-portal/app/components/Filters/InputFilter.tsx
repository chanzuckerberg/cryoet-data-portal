import { InputText } from '@czi-sds/components'

export function InputFilter({
  id,
  label,
  onChange,
  value,
}: {
  id: string
  label: string
  onChange(value: string): void
  value: string
}) {
  return (
    <div>
      <InputText
        id={id}
        label={label}
        onChange={(event) => onChange(event.target.value)}
        value={value}
        fullWidth
      />
    </div>
  )
}
