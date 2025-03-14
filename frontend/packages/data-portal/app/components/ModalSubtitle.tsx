import { ReactNode } from 'react'

export function ModalSubtitle({
  label,
  value,
}: {
  label: ReactNode
  value: ReactNode
}) {
  return (
    <p className="text-light-sds-color-semantic-base-text-secondary text-sds-body-xs-400-wide leading-sds-body-xs">
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </p>
  )
}
