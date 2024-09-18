import { cns, cnsNoMerge } from 'app/utils/cns'

export interface Metadata {
  key: string
  value: string

  uppercase?: boolean
  keyClass?: string
  valueClass?: string
}

export function InlineMetadata({
  label,
  fields,
  subheader = false,
}: {
  label?: string
  fields: Metadata[]
  subheader?: boolean
}) {
  const fieldsRender = (
    <ul className="list-none flex gap-sds-l items-baseline">
      {fields.map(({ key, value, uppercase, keyClass, valueClass }) => (
        <li
          className={cns(
            'flex flex-row items-baseline justify-left gap-sds-xxs',
            subheader && 'text-sds-color-primitive-gray-500',
          )}
          key={key + value}
        >
          <span
            className={cnsNoMerge(
              'font-semibold',
              subheader
                ? 'text-sds-color-primitive-gray-600 tracking-sds-body-xxs text-sds-caps-xxs leading-sds-caps-xxs'
                : 'text-sds-body-xxs leading-sds-body-xxs',
              uppercase && 'uppercase',
              subheader && uppercase && 'tracking-sds-caps',
              keyClass,
            )}
          >
            {key}:
          </span>

          <span
            className={cnsNoMerge(
              subheader
                ? 'text-sds-body-s leading-sds-body-s'
                : 'text-sds-body-xxs leading-sds-body-xxs',
              valueClass,
            )}
          >
            {value}
          </span>
        </li>
      ))}
    </ul>
  )

  if (label) {
    return (
      <div className="flex flex-row gap-sds-xl text-sds-color-primitive-common-black items-baseline">
        <span className="text-sds-caps-xxxs leading-sds-caps-xxxs font-semibold uppercase tracking-sds-caps">
          {label}
        </span>
        {fieldsRender}
      </div>
    )
  }

  return fieldsRender
}
