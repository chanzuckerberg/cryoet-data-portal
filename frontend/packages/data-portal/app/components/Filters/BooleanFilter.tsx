import { InputCheckbox } from '@czi-sds/components'

export function BooleanFilter({
  label,
  onChange,
  value,
}: {
  label: string
  onChange(value: boolean): void
  value: boolean
}) {
  return (
    <div className="pl-sds-m whitespace-nowrap">
      <InputCheckbox
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
        label={label}
      />
    </div>
  )
}
